import { TripService } from "@/services/trips";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Metadata, ResolvingMetadata } from "next";
import { MapPin, Calendar, Users, Download, Info } from "lucide-react";
import Link from "next/link";
import { env } from "@/env";

type Props = {
  params: Promise<{ slug: string }>;
};

// Revalidate on demand or every hour
export const revalidate = 3600;

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const trip = await TripService.getTripBySlug(slug);
  
  if (!trip) {
    return { title: "Trip Not Found" };
  }

  const coverImage = trip.images.find(img => img.isCover)?.url || trip.images[0]?.url;

  return {
    title: `${trip.title} - ToursBU`,
    description: trip.shortDesc || trip.description?.substring(0, 160) || "Join us on this amazing student trip.",
    alternates: {
      canonical: `${env.NEXT_PUBLIC_APP_URL}/trips/${trip.slug}`,
    },
    openGraph: {
      title: trip.title,
      description: trip.shortDesc || undefined,
      url: `${env.NEXT_PUBLIC_APP_URL}/trips/${trip.slug}`,
      siteName: "ToursBU",
      images: coverImage ? [{ url: coverImage, width: 1200, height: 630 }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: trip.title,
      description: trip.shortDesc || undefined,
      images: coverImage ? [coverImage] : [],
    },
  };
}

export default async function TripDetailsPage({ params }: Props) {
  const { slug } = await params;
  const trip = await TripService.getTripBySlug(slug);

  if (!trip) {
    notFound();
  }

  const coverImage = trip.images.find((img: any) => img.isCover)?.url || trip.images[0]?.url;
  const galleryImages = trip.images.filter((img: any) => !img.isCover);

  // Generate JSON-LD Structured Data
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": env.NEXT_PUBLIC_APP_URL },
      { "@type": "ListItem", "position": 2, "name": "Explore", "item": `${env.NEXT_PUBLIC_APP_URL}/explore` },
      { "@type": "ListItem", "position": 3, "name": trip.title, "item": `${env.NEXT_PUBLIC_APP_URL}/trips/${trip.slug}` }
    ]
  };

  const touristTripSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": trip.title,
    "description": trip.description || trip.shortDesc,
    "touristType": ["Student"],
    "itinerary": trip.days.map((day: any, index: number) => ({
      "@type": "City",
      "name": day.title,
      "position": index + 1
    })),
    "offers": trip.price ? {
      "@type": "Offer",
      "price": trip.price,
      "priceCurrency": "INR"
    } : undefined
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristTripSchema) }}
      />

      {/* Hero Image */}
      <div className="w-full h-[50vh] relative bg-gray-900">
        {coverImage ? (
          <Image
            src={coverImage}
            alt={trip.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-200">
            No cover image available
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
          <div className="max-w-7xl mx-auto">
            {trip.category && (
              <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-semibold mb-4 border border-white/30">
                {trip.category.name}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-black text-white max-w-4xl leading-tight">
              {trip.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 mt-6 text-white/90 font-medium">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                {trip.location || "Location TBD"}
              </div>
              {trip.startDate && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  {trip.startDate.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              )}
              {trip.capacity !== null && (
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  {trip.capacity} Seats Total
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col lg:flex-row gap-12">
        {/* Main Content */}
        <div className="flex-1 space-y-16">
          
          {/* Description */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">About this trip</h2>
            <div className="prose prose-lg text-gray-600 max-w-none">
              {trip.description ? (
                <p className="whitespace-pre-wrap">{trip.description}</p>
              ) : (
                <p>{trip.shortDesc}</p>
              )}
            </div>
          </section>

          {/* Itinerary */}
          {trip.days.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Itinerary</h2>
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                {trip.days.map((day: any, index: number) => (
                  <div key={day.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Icon */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-black text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                      <h3 className="font-bold text-gray-900 text-lg mb-4">{day.title}</h3>
                      <div className="space-y-3">
                        {day.activities.map((activity: any) => (
                          <div key={activity.id} className="flex gap-3 text-sm">
                            <div className="text-gray-400 font-medium w-16 shrink-0">{activity.time || "All day"}</div>
                            <div className="text-gray-700">{activity.title}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* FAQs */}
          {trip.faqs.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {trip.faqs.map((faq: any) => (
                  <details key={faq.id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-gray-900">
                      {faq.question}
                      <span className="transition group-open:rotate-180">
                        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                      </span>
                    </summary>
                    <div className="px-6 pb-6 text-gray-600">
                      <p className="whitespace-pre-wrap">{faq.answer}</p>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar Sticky Booking Card */}
        <div className="w-full lg:w-96 shrink-0">
          <div className="sticky top-8 bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <p className="text-gray-500 font-medium mb-1">Starting from</p>
              <p className="text-5xl font-black text-gray-900">
                {trip.price ? `₹${trip.price.toLocaleString()}` : "TBA"}
              </p>
              {trip.advanceAmount && (
                <p className="text-sm text-gray-500 mt-2">Book now with ₹{trip.advanceAmount.toLocaleString()} advance</p>
              )}
            </div>

            <Link 
              href={`/trips/${trip.slug}/book`}
              className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200 block text-center"
            >
              Book Now
            </Link>

            {trip.brochureUrl && (
              <a 
                href={trip.brochureUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full mt-4 py-4 bg-white text-gray-900 border-2 border-gray-100 rounded-xl font-bold hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download Brochure
              </a>
            )}

            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex gap-4 items-start">
                <Info className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-sm text-gray-500 leading-relaxed">
                  Have questions? Contact our student coordinators for more details about this itinerary.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
