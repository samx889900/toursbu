import { PageHeader } from "@/components/shared/page-header";
import Link from "next/link";
import { TripService } from "@/services/trips";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function TripEditLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const trip = await prisma.trip.findUnique({
    where: { id },
  });

  if (!trip) {
    notFound();
  }

  const tabs = [
    { name: "General", href: `/admin/trips/${id}/edit` },
    { name: "Images & Brochure", href: `/admin/trips/${id}/edit/images` },
    { name: "Itinerary", href: `/admin/trips/${id}/edit/itinerary` },
    { name: "Settings & Publish", href: `/admin/trips/${id}/edit/settings` },
  ];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <PageHeader 
        title={`Editing: ${trip.title}`} 
        description="Changes made in each section are saved automatically when you proceed."
        actions={
          <Link 
            href={`/trips/${trip.slug}`}
            target="_blank"
            className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors"
          >
            Preview Trip
          </Link>
        }
      />

      <div className="mt-8 flex flex-col md:flex-row gap-8 items-start">
        {/* Sidebar Navigation */}
        <nav className="w-full md:w-64 flex flex-col gap-1 shrink-0 bg-white border border-gray-100 rounded-xl p-2 shadow-sm">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className="px-4 py-2.5 text-sm font-medium rounded-lg hover:bg-gray-50 text-gray-700 transition-colors"
            >
              {tab.name}
            </Link>
          ))}
        </nav>

        {/* Form Content Area */}
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
