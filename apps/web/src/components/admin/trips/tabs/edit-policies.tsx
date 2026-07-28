"use client";

import { useState } from "react";
import { updateTripPoliciesAction } from "@/actions/trips";
import { Loader2, Save, Plus, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PolicyType } from "@prisma/client";

export function TripPoliciesTab({ trip }: { trip: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [policies, setPolicies] = useState<{ type: PolicyType; title: string; description: string; order: number; id: string }[]>(
    (trip.policies || []).map((p: any, i: number) => ({ ...p, id: p.id || `temp-${i}` }))
  );
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  async function handleSave() {
    setIsSaving(true);
    
    const cleanedPolicies = policies.map((p, idx) => ({
      type: p.type,
      title: p.title,
      description: p.description,
      order: idx,
    }));

    const res = await updateTripPoliciesAction(trip.id, cleanedPolicies);
    
    if (res.success) {
      toast.success("Policies saved successfully!");
    } else {
      toast.error(res.error || "Failed to save policies");
    }
    setIsSaving(false);
  }

  const handleAddPolicy = () => {
    setPolicies([...policies, { type: "CANCELLATION", title: "", description: "", order: policies.length, id: `temp-${Date.now()}` }]);
  };

  const handleRemovePolicy = (index: number) => {
    setPolicies(policies.filter((_, i) => i !== index));
  };

  const handlePolicyChange = (index: number, field: string, value: string) => {
    const newPolicies = [...policies];
    (newPolicies[index] as any)[field] = value;
    setPolicies(newPolicies);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); 
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    const newPolicies = [...policies];
    const draggedItem = newPolicies[draggedItemIndex];
    
    newPolicies.splice(draggedItemIndex, 1);
    newPolicies.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    setPolicies(newPolicies);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Policies</h2>
          <p className="text-sm text-gray-500 mt-1">Cancellation, terms, and safety policies. Drag to reorder.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Policies
        </button>
      </div>

      <div className="p-6 space-y-4">
        {policies.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No policies added yet.</p>
            <button
              onClick={handleAddPolicy}
              className="mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              + Add First Policy
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {policies.map((policy, index) => (
              <div 
                key={policy.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex gap-4 p-4 bg-white border border-gray-200 rounded-xl transition-all ${
                  draggedItemIndex === index ? 'opacity-50 ring-2 ring-[hsl(var(--primary))] scale-[0.99]' : ''
                }`}
              >
                <div className="pt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-900">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="flex gap-4">
                    <select
                      value={policy.type}
                      onChange={(e) => handlePolicyChange(index, "type", e.target.value)}
                      className="w-48 px-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-[hsl(var(--primary))] rounded-lg text-sm font-semibold text-gray-900 transition-all outline-none"
                    >
                      <option value="CANCELLATION">Cancellation</option>
                      <option value="REFUND">Refund</option>
                      <option value="TERMS">Terms & Conditions</option>
                      <option value="SAFETY">Safety</option>
                      <option value="ELIGIBILITY">Eligibility</option>
                      <option value="MEDICAL">Medical</option>
                      <option value="PACKING">Packing</option>
                    </select>
                    
                    <input
                      type="text"
                      value={policy.title}
                      onChange={(e) => handlePolicyChange(index, "title", e.target.value)}
                      placeholder="Policy Title (Optional)"
                      className="flex-1 px-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-[hsl(var(--primary))] rounded-lg text-sm font-semibold text-gray-900 transition-all outline-none"
                    />
                  </div>
                  
                  <textarea
                    value={policy.description}
                    onChange={(e) => handlePolicyChange(index, "description", e.target.value)}
                    placeholder="Policy details (Markdown supported)..."
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-[hsl(var(--primary))] rounded-lg text-sm text-gray-700 transition-all outline-none resize-none"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={() => handleRemovePolicy(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={handleAddPolicy}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Policy
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
