import { PageHeader } from "@/components/shared/page-header";
import { Search, Filter, Calendar, MapPin, ChevronRight, User } from "lucide-react";
import Link from "next/link";
import { TripService } from "@/services/trips";
import { TripStatus } from "@prisma/client";
import Image from "next/image";

// Revalidate this page every hour, or on demand when a trip is published
export const revalidate = 3600;

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { q?: string; category?: string };
}) {
  const query = searchParams.q || "";
  const categoryId = searchParams.category || "";

  // Fetch only PUBLISHED trips
  const { trips, total } = await TripService.searchTrips({
    query,
    categoryId,
    status: TripStatus.PUBLISHED,
    limit: 20,
    orderBy: "newest", // Or parse from searchParams
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PageHeader 
            title="Explore Trips" 
            description="Discover your next adventure with our curated student trips."
          />

          <div className="mt-8 max-w-2xl flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search destinations, colleges..." 
                defaultValue={query}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 transition-shadow"
              />
            </div>
            <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            {total} {total === 1 ? 'Trip' : 'Trips'} Found
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <Link 
              key={trip.id} 
              href={`/trips/${trip.slug}`} 
              className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Section */}
              <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                {trip.images[0] ? (
                  <Image
                    src={trip.images[0].url}
                    alt={trip.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO88OjRf4AJjgO6yZqOqwAAAABJRU5ErkJggg=="
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-medium">
                    No Image
                  </div>
                )}
                
                {/* Category Badge */}
                {trip.category && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-gray-900 shadow-sm">
                    {trip.category.name}
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {trip.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{trip.location || "Location TBD"}</span>
                </div>

                <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1">
                  {trip.shortDesc || trip.description?.substring(0, 100) || "No description available."}
                </p>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Starting from</p>
                    <p className="text-lg font-bold text-gray-900">
                      {trip.price ? `₹${trip.price.toLocaleString()}` : "TBA"}
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {trips.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 mt-8">
            <h3 className="text-lg font-bold text-gray-900">No trips found</h3>
            <p className="text-gray-500 mt-2">Try adjusting your filters or search query.</p>
          </div>
        )}
      </div>
    </div>
  );
}
