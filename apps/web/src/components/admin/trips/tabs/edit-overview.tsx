"use client";

import { useState } from "react";
import { updateTripOverviewAction } from "@/actions/trips";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Category } from "@prisma/client";

export function TripOverviewTab({ trip, categories }: { trip: any; categories: Category[] }) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await updateTripOverviewAction(trip.id, formData);
    
    if (res.success) {
      toast.success("Overview saved successfully!");
    } else {
      toast.error(res.error || "Failed to save");
    }
    setIsSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Trip Overview</h2>
          <p className="text-sm text-gray-500 mt-1">General details, descriptions, and locations.</p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Overview
        </button>
      </div>

      <div className="p-6 space-y-8">
        {/* Core Details */}
        <div>
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Core Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Trip Title *</label>
              <input 
                type="text" 
                name="title" 
                defaultValue={trip.title}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select 
                name="categoryId" 
                defaultValue={trip.categoryId || ""}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all bg-white"
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Difficulty</label>
              <input 
                type="text" 
                name="difficulty" 
                defaultValue={trip.difficulty || ""}
                placeholder="e.g. Moderate" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Duration</label>
              <input 
                type="text" 
                name="duration" 
                defaultValue={trip.duration || ""}
                placeholder="e.g. 5 Days / 4 Nights" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Descriptions</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Description</label>
              <textarea 
                name="shortDesc" 
                defaultValue={trip.shortDesc || ""}
                rows={2}
                placeholder="Brief catchy summary..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Description (Markdown supported)</label>
              <textarea 
                name="description" 
                defaultValue={trip.description || ""}
                rows={8}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Highlights (Comma separated)</label>
              <input 
                type="text" 
                name="highlights" 
                defaultValue={(trip.highlights || []).join(", ")}
                placeholder="e.g. Bonfire, River Rafting, DJ Night"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tags (Comma separated)</label>
              <input 
                type="text" 
                name="tags" 
                defaultValue={(trip.tags || []).join(", ")}
                placeholder="e.g. adventure, weekend, trending"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="pt-6 border-t border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Location & Maps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Location</label>
              <input 
                type="text" 
                name="location" 
                defaultValue={trip.location || ""}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meeting Point</label>
              <input 
                type="text" 
                name="meetingPoint" 
                defaultValue={trip.meetingPoint || ""}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pickup Point</label>
              <input 
                type="text" 
                name="pickupPoint" 
                defaultValue={trip.pickupPoint || ""}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Drop Point</label>
              <input 
                type="text" 
                name="dropPoint" 
                defaultValue={trip.dropPoint || ""}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Google Maps URL</label>
              <input 
                type="url" 
                name="googleMapsUrl" 
                defaultValue={trip.googleMapsUrl || ""}
                placeholder="https://maps.google.com/..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
