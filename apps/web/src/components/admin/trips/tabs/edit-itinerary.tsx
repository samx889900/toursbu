"use client";

import { useState } from "react";
import { updateTripItineraryAction } from "@/actions/trips";
import { Loader2, Save, Plus, GripVertical, Trash2, Clock, MapPin, Utensils, Car, Bed, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export function TripItineraryTab({ trip }: { trip: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [days, setDays] = useState<any[]>(
    (trip.days || []).map((d: any, di: number) => ({
      ...d,
      id: d.id || `day-${di}`,
      activities: (d.activities || []).map((a: any, ai: number) => ({ ...a, id: a.id || `act-${di}-${ai}` }))
    }))
  );
  
  const [draggedDayIndex, setDraggedDayIndex] = useState<number | null>(null);
  const [expandedDays, setExpandedDays] = useState<Set<number>>(new Set(days.map((_, i) => i)));

  async function handleSave() {
    setIsSaving(true);
    
    const cleanedDays = days.map((d, di) => ({
      title: d.title,
      order: di,
      activities: d.activities.map((a: any, ai: number) => ({
        title: a.title,
        time: a.time,
        location: a.location,
        description: a.description,
        meals: a.meals,
        transportation: a.transportation,
        accommodation: a.accommodation,
        order: ai
      }))
    }));

    const res = await updateTripItineraryAction(trip.id, cleanedDays);
    
    if (res.success) {
      toast.success("Itinerary saved successfully!");
    } else {
      toast.error(res.error || "Failed to save itinerary");
    }
    setIsSaving(false);
  }

  const handleAddDay = () => {
    const newIndex = days.length;
    setDays([...days, { title: `Day ${newIndex + 1}`, order: newIndex, activities: [], id: `day-${Date.now()}` }]);
    setExpandedDays(new Set([...expandedDays, newIndex]));
  };

  const handleRemoveDay = (dayIndex: number) => {
    setDays(days.filter((_, i) => i !== dayIndex));
  };

  const handleDayChange = (dayIndex: number, title: string) => {
    const newDays = [...days];
    newDays[dayIndex].title = title;
    setDays(newDays);
  };

  const toggleDayExpanded = (dayIndex: number) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(dayIndex)) newExpanded.delete(dayIndex);
    else newExpanded.add(dayIndex);
    setExpandedDays(newExpanded);
  };

  const handleAddActivity = (dayIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].activities.push({
      title: "",
      time: "",
      location: "",
      description: "",
      meals: false,
      transportation: "",
      accommodation: "",
      id: `act-${Date.now()}`
    });
    setDays(newDays);
  };

  const handleRemoveActivity = (dayIndex: number, actIndex: number) => {
    const newDays = [...days];
    newDays[dayIndex].activities.splice(actIndex, 1);
    setDays(newDays);
  };

  const handleActivityChange = (dayIndex: number, actIndex: number, field: string, value: any) => {
    const newDays = [...days];
    newDays[dayIndex].activities[actIndex][field] = value;
    setDays(newDays);
  };

  // HTML5 Drag and Drop for Days
  const handleDragStartDay = (e: React.DragEvent, index: number) => {
    setDraggedDayIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverDay = (e: React.DragEvent, index: number) => {
    e.preventDefault(); 
    if (draggedDayIndex === null || draggedDayIndex === index) return;
    
    const newDays = [...days];
    const draggedItem = newDays[draggedDayIndex];
    newDays.splice(draggedDayIndex, 1);
    newDays.splice(index, 0, draggedItem);
    
    setDraggedDayIndex(index);
    setDays(newDays);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Itinerary Builder</h2>
          <p className="text-sm text-gray-500 mt-1">Plan the day-by-day schedule for your travelers.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Itinerary
        </button>
      </div>

      <div className="p-6 space-y-6">
        {days.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No days added to the itinerary.</p>
            <button
              onClick={handleAddDay}
              className="mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              + Add Day 1
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {days.map((day, dayIndex) => (
              <div 
                key={day.id}
                draggable
                onDragStart={(e) => handleDragStartDay(e, dayIndex)}
                onDragOver={(e) => handleDragOverDay(e, dayIndex)}
                onDragEnd={() => setDraggedDayIndex(null)}
                className={`bg-white border border-gray-200 rounded-2xl overflow-hidden transition-all ${
                  draggedDayIndex === dayIndex ? 'opacity-50 ring-2 ring-[hsl(var(--primary))] scale-[0.99]' : 'shadow-sm'
                }`}
              >
                {/* Day Header */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 border-b border-gray-100">
                  <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-900">
                    <GripVertical className="w-5 h-5" />
                  </div>
                  <div className="flex-1 flex items-center gap-3">
                    <div className="w-16 text-sm font-bold text-gray-400">Day {dayIndex + 1}</div>
                    <input
                      type="text"
                      value={day.title}
                      onChange={(e) => handleDayChange(dayIndex, e.target.value)}
                      placeholder="e.g. Arrival in Manali & Local Sightseeing"
                      className="flex-1 px-3 py-1.5 bg-white border border-gray-200 focus:border-[hsl(var(--primary))] rounded-lg text-sm font-semibold text-gray-900 transition-all outline-none"
                    />
                  </div>
                  <button onClick={() => toggleDayExpanded(dayIndex)} className="p-1.5 text-gray-500 hover:bg-gray-200 rounded-lg">
                    {expandedDays.has(dayIndex) ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  <button onClick={() => handleRemoveDay(dayIndex)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Day Content (Activities) */}
                {expandedDays.has(dayIndex) && (
                  <div className="p-6 space-y-6 bg-white">
                    {day.activities.map((act: any, actIndex: number) => (
                      <div key={act.id} className="relative pl-8 before:content-[''] before:absolute before:left-3.5 before:top-8 before:bottom-[-24px] before:w-0.5 before:bg-gray-100 last:before:hidden">
                        <div className="absolute left-2 top-2 w-3.5 h-3.5 rounded-full bg-[hsl(var(--primary))] ring-4 ring-white shadow-sm z-10" />
                        
                        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <input
                              type="text"
                              value={act.title}
                              onChange={(e) => handleActivityChange(dayIndex, actIndex, "title", e.target.value)}
                              placeholder="Activity Title (e.g. Visit Hadimba Temple)"
                              className="flex-1 px-3 py-2 bg-white border border-gray-200 focus:border-[hsl(var(--primary))] rounded-lg text-sm font-bold text-gray-900 outline-none"
                            />
                            <button onClick={() => handleRemoveActivity(dayIndex, actIndex)} className="p-2 text-gray-400 hover:text-red-500 bg-white rounded-lg border border-gray-200">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-400 shrink-0" />
                              <input
                                type="text"
                                value={act.time || ""}
                                onChange={(e) => handleActivityChange(dayIndex, actIndex, "time", e.target.value)}
                                placeholder="Time (e.g. 10:00 AM - 12:00 PM)"
                                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 focus:border-[hsl(var(--primary))] rounded-lg text-sm text-gray-700 outline-none"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                              <input
                                type="text"
                                value={act.location || ""}
                                onChange={(e) => handleActivityChange(dayIndex, actIndex, "location", e.target.value)}
                                placeholder="Location"
                                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 focus:border-[hsl(var(--primary))] rounded-lg text-sm text-gray-700 outline-none"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4 text-gray-400 shrink-0" />
                              <input
                                type="text"
                                value={act.transportation || ""}
                                onChange={(e) => handleActivityChange(dayIndex, actIndex, "transportation", e.target.value)}
                                placeholder="Transport (e.g. Volvo Bus, Trek)"
                                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 focus:border-[hsl(var(--primary))] rounded-lg text-sm text-gray-700 outline-none"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <Bed className="w-4 h-4 text-gray-400 shrink-0" />
                              <input
                                type="text"
                                value={act.accommodation || ""}
                                onChange={(e) => handleActivityChange(dayIndex, actIndex, "accommodation", e.target.value)}
                                placeholder="Stay (e.g. 3-star Hotel)"
                                className="flex-1 px-3 py-1.5 bg-white border border-gray-200 focus:border-[hsl(var(--primary))] rounded-lg text-sm text-gray-700 outline-none"
                              />
                            </div>
                          </div>

                          <textarea
                            value={act.description || ""}
                            onChange={(e) => handleActivityChange(dayIndex, actIndex, "description", e.target.value)}
                            placeholder="Activity description..."
                            rows={2}
                            className="w-full px-3 py-2 bg-white border border-gray-200 focus:border-[hsl(var(--primary))] rounded-lg text-sm text-gray-700 outline-none resize-none"
                          />

                          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-gray-200 w-fit">
                            <input
                              type="checkbox"
                              id={`meals-${dayIndex}-${actIndex}`}
                              checked={act.meals}
                              onChange={(e) => handleActivityChange(dayIndex, actIndex, "meals", e.target.checked)}
                              className="rounded border-gray-300 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]"
                            />
                            <label htmlFor={`meals-${dayIndex}-${actIndex}`} className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer">
                              <Utensils className="w-3.5 h-3.5 text-gray-400" />
                              Meals Included
                            </label>
                          </div>

                        </div>
                      </div>
                    ))}
                    
                    <button
                      onClick={() => handleAddActivity(dayIndex)}
                      className="ml-8 mt-4 px-4 py-2 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:text-[hsl(var(--primary))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary)/0.05)] transition-all flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Activity
                    </button>
                  </div>
                )}
              </div>
            ))}
            
            <button
              onClick={handleAddDay}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-bold text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Day {days.length + 1}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
