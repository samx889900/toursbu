"use client";

import { useState } from "react";
import { Loader2, Save } from "lucide-react";

import { use } from "react";

export default function TripGeneralEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  // In a real app, we'd fetch the trip data in a Server Component and pass it as initialData
  // For this milestone, we'll implement the form UI and Server Action wireframe
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    // Simulate server action
    setTimeout(() => setIsSaving(false), 1000);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
      <div className="p-6 border-b border-gray-100">
        <h2 className="text-lg font-bold text-gray-900">General Information</h2>
        <p className="text-sm text-gray-500 mt-1">Update the core details of your trip.</p>
      </div>

      <form onSubmit={handleSave} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                type="text" 
                defaultValue="Manali Snow Trek"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <textarea 
                rows={3}
                placeholder="A brief summary for the cards..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input 
                type="text" 
                defaultValue="Himachal Pradesh"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Base Price (INR)</label>
              <input 
                type="number" 
                placeholder="e.g. 5000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Advance Amount (INR)</label>
              <input 
                type="number" 
                placeholder="e.g. 1000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Total Capacity (Seats)</label>
              <input 
                type="number" 
                placeholder="e.g. 40"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
          <textarea 
            rows={6}
            placeholder="Detailed description of the trip..."
            className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 flex justify-end">
          <button 
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
