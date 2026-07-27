"use client";

import { useState } from "react";
import { Plus, Search, Filter, Pencil, Archive, Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { createTripAction } from "@/actions/trips";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";

type TripData = {
  id: string;
  title: string;
  location: string | null;
  startDate: Date | null;
  endDate: Date | null;
  status: string;
  price: number | null;
  capacity: number | null;
  _count: { bookings: number };
};

export function TripsClient({ initialTrips }: { initialTrips: TripData[] }) {
  const router = useRouter();
  const [trips, setTrips] = useState(initialTrips);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const filteredTrips = trips.filter(
    (t) =>
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.location && t.location.toLowerCase().includes(search.toLowerCase()))
  );

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED": return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">Published</span>;
      case "DRAFT": return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">Draft</span>;
      case "ARCHIVED": return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">Archived</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">{status}</span>;
    }
  };

  return (
    <div className="p-8">
      <PageHeader 
        title="Trips" 
        description="Manage all your trips, itineraries, and settings from here."
        actions={
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Trip
          </button>
        }
      />

      {/* Basic Filters & Search */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search trips by title or location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
          />
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
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
              className="mt-6 text-sm font-semibold text-[hsl(var(--primary))] hover:opacity-80 transition-colors"
            >
              + Create your first trip
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
              <tr>
                <th className="px-6 py-4">Title & Location</th>
                <th className="px-6 py-4">Dates</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Price</th>
                <th className="px-6 py-4 text-center">Bookings</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTrips.map((trip) => (
                <tr key={trip.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="font-semibold text-gray-900">{trip.title}</div>
                    <div className="text-gray-500 text-xs flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3" />
                      {trip.location || "No location set"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {trip.startDate ? new Date(trip.startDate).toLocaleDateString() : "TBD"}
                    {trip.endDate && ` - ${new Date(trip.endDate).toLocaleDateString()}`}
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(trip.status)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">
                    {trip.price ? formatCurrency(trip.price) : "—"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-gray-900 font-medium">{trip._count.bookings}</span>
                    <span className="text-gray-400 mx-1">/</span>
                    <span className="text-gray-500">{trip.capacity || "∞"}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/trips/${trip.id}/edit`}
                      className="inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Draft Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Start a new trip</h2>
              <p className="text-sm text-gray-500 mt-1">Create a draft to begin building your itinerary.</p>
            </div>

            <form onSubmit={handleCreateDraft} className="p-6 space-y-5 bg-gray-50/30">
              <div>
                <label htmlFor="title" className="block text-xs font-semibold text-gray-700 mb-1.5">Trip Title *</label>
                <input 
                  type="text" 
                  id="title" 
                  name="title" 
                  required
                  placeholder="e.g. Manali Snow Trek" 
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
                />
              </div>

              <div>
                <label htmlFor="location" className="block text-xs font-semibold text-gray-700 mb-1.5">Location</label>
                <input 
                  type="text" 
                  id="location" 
                  name="location" 
                  placeholder="e.g. Himachal Pradesh" 
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
                />
              </div>

              <div>
                <label htmlFor="startDate" className="block text-xs font-semibold text-gray-700 mb-1.5">Tentative Start Date</label>
                <input 
                  type="date" 
                  id="startDate" 
                  name="startDate" 
                  className="w-full px-4 py-2.5 border border-gray-200 bg-white rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all text-gray-700"
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 font-medium">
                  {error}
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isCreating}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
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
      )}
    </div>
  );
}
