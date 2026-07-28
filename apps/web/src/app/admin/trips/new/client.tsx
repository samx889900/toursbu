"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { createTripAction } from "@/actions/trips";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Category } from "@prisma/client";

export function CreateTripClient({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
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
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link 
          href="/admin/trips"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Trips
        </Link>
      </div>

      <PageHeader 
        title="Create New Trip" 
        description="Provide the basic details to start a new draft. You can add images, detailed itineraries, and pricing rules later."
      />

      <div className="mt-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleCreate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-1.5">Trip Title *</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                required
                placeholder="e.g. Spiti Valley Expedition" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
              />
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1.5">Primary Location</label>
              <input 
                type="text" 
                id="location" 
                name="location" 
                placeholder="e.g. Himachal Pradesh" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
              />
            </div>

            <div>
              <label htmlFor="categoryId" className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
              <select 
                id="categoryId" 
                name="categoryId" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all bg-white"
              >
                <option value="">Select a category...</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-semibold text-gray-700 mb-1.5">Tentative Start Date</label>
              <input 
                type="date" 
                id="startDate" 
                name="startDate" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all text-gray-700"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-semibold text-gray-700 mb-1.5">Tentative End Date</label>
              <input 
                type="date" 
                id="endDate" 
                name="endDate" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all text-gray-700"
              />
            </div>

            <div>
              <label htmlFor="capacity" className="block text-sm font-semibold text-gray-700 mb-1.5">Capacity (Max Travelers)</label>
              <input 
                type="number" 
                id="capacity" 
                name="capacity" 
                min="1"
                placeholder="e.g. 20" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-1.5">Base Price (₹)</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                min="0"
                placeholder="e.g. 15000" 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="shortDesc" className="block text-sm font-semibold text-gray-700 mb-1.5">Short Description</label>
              <textarea 
                id="shortDesc" 
                name="shortDesc" 
                rows={3}
                placeholder="A brief catchy summary of the trip..." 
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all resize-none"
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
              {error}
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              disabled={isCreating}
              className="px-6 py-2.5 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isCreating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Draft"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
