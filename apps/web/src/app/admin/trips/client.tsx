"use client";

import { Search, Filter, Pencil, Archive, MapPin } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { useTransition, useState, useEffect } from "react";

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

export function TripsClient({ 
  trips,
  total,
  totalPages,
  currentPage,
  searchParams,
}: { 
  trips: TripData[];
  total: number;
  totalPages: number;
  currentPage: number;
  searchParams: any;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const sp = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState(searchParams.query || "");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (search !== (searchParams.query || "")) {
        handleSearch(search);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  function handleSearch(term: string) {
    const params = new URLSearchParams(sp.toString());
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleFilter(key: string, value: string) {
    const params = new URLSearchParams(sp.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
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
          <Link
            href="/admin/trips/new"
            className="bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
          >
            Create Trip
          </Link>
        }
      />

      {/* Advanced Filters & Search */}
      <div className="mt-8 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-6">
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search trips by title or location..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] focus:ring-2 focus:ring-[hsl(var(--primary)/0.15)] transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full lg:w-auto">
          <select 
            onChange={(e) => handleFilter("status", e.target.value)}
            value={searchParams.status || ""}
            className="flex-1 lg:flex-none px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
          >
            <option value="">All Statuses</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
          <select 
            onChange={(e) => handleFilter("isArchived", e.target.value)}
            value={searchParams.isArchived || ""}
            className="flex-1 lg:flex-none px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
          >
            <option value="">Active</option>
            <option value="true">Archived</option>
          </select>
          <select 
            onChange={(e) => handleFilter("orderBy", e.target.value)}
            value={searchParams.orderBy || "newest"}
            className="flex-1 lg:flex-none px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="upcoming">Upcoming</option>
            <option value="most_booked">Most Booked</option>
            <option value="revenue">Highest Revenue</option>
          </select>
        </div>
      </div>

      {trips.length === 0 ? (
        <div className="mt-6 bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="flex flex-col items-center justify-center p-16 text-center">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Archive className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">No trips found</h3>
            <p className="text-gray-500 text-sm mt-1 max-w-sm">
              Adjust your filters or get started by creating a new trip draft.
            </p>
            <Link
              href="/admin/trips/new"
              className="mt-6 text-sm font-semibold text-[hsl(var(--primary))] hover:opacity-80 transition-colors"
            >
              + Create your first trip
            </Link>
          </div>
        </div>
      ) : (
        <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm transition-opacity ${isPending ? 'opacity-50' : ''}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left whitespace-nowrap">
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
                {trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 min-w-[250px]">
                      <div className="font-semibold text-gray-900 truncate">{trip.title}</div>
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
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage <= 1 || isPending}
                  onClick={() => handleFilter("page", String(currentPage - 1))}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage >= totalPages || isPending}
                  onClick={() => handleFilter("page", String(currentPage + 1))}
                  className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
