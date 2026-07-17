"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, Pencil, Copy, Trash2, Archive, Loader2 } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { createTripAction } from "@/actions/trips";
import { useRouter } from "next/navigation";

// A minimal UI component to represent the Trips List page
export default function AdminTripsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreateDraft(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsCreating(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createTripAction(formData);

    if (result.success && result.tripId) {
      router.push(`/admin/trips/${result.tripId}/edit`);
    } else {
      setError(result.error || "Something went wrong");
      setIsCreating(false);
    }
  }

  return (
    <div className="p-8">
      <PageHeader 
        title="Trips" 
        description="Manage all your trips, itineraries, and settings from here."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Trip
          </button>
        }
      />

      {/* Basic Filters & Search */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search trips by title or location..." 
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 bg-white rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors text-gray-700 w-full sm:w-auto justify-center">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Data Table Placeholder (We will fetch real data later when we implement the full table component, for now it's an empty state) */}
      <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="flex flex-col items-center justify-center p-16 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Archive className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">No trips found</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm">
            Get started by creating your first trip draft. You can add images, dates, and itineraries later.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-6 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            + Create your first trip
          </button>
        </div>
      </div>

      {/* Create Draft Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Start a new trip</h2>
                <p className="text-sm text-gray-500 mt-1">Create a draft to begin building your itinerary.</p>
              </div>
            </div>

            <form onSubmit={handleCreateDraft} className="p-6 space-y-5">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Trip Title *</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  required
                  placeholder="e.g. Manali Snow Trek" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  placeholder="e.g. Himachal Pradesh" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Tentative Start Date</label>
                <input 
                  type="date" 
                  id="startDate" 
                  name="startDate" 
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow text-gray-700"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-4 py-2 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating Draft...
                    </>
                  ) : (
                    "Create Draft"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
