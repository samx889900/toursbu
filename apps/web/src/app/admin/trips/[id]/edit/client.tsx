"use client";

import { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ArrowLeft, Save, Globe, Eye, Settings, Image as ImageIcon, Map, IndianRupee, FileText, ShieldAlert, BarChart3, LayoutDashboard, Search } from "lucide-react";
import Link from "next/link";
import { Category } from "@prisma/client";

import { TripOverviewTab } from "@/components/admin/trips/tabs/edit-overview";
import { TripPricingTab } from "@/components/admin/trips/tabs/edit-pricing";
import { TripSEOTab } from "@/components/admin/trips/tabs/edit-seo";
import { TripSettingsTab } from "@/components/admin/trips/tabs/edit-settings";
import { TripFAQsTab } from "@/components/admin/trips/tabs/edit-faqs";
import { TripPoliciesTab } from "@/components/admin/trips/tabs/edit-policies";
import { TripItineraryTab } from "@/components/admin/trips/tabs/edit-itinerary";
import { TripGalleryTab } from "@/components/admin/trips/tabs/edit-gallery";
import { PublishValidator } from "@/components/admin/trips/tabs/publish-validator";
import { publishTripAction } from "@/actions/trips";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Placeholder tabs for complex features that require dedicated files
const PlaceholderTab = ({ name }: { name: string }) => (
  <div className="p-16 text-center text-gray-500 bg-white border border-gray-200 rounded-2xl">
    {name} Tab Content is under construction.
  </div>
);

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "gallery", label: "Gallery", icon: ImageIcon },
  { id: "itinerary", label: "Itinerary", icon: Map },
  { id: "pricing", label: "Pricing", icon: IndianRupee },
  { id: "faqs", label: "FAQs", icon: FileText },
  { id: "policies", label: "Policies", icon: ShieldAlert },
  { id: "seo", label: "SEO", icon: Search },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

export function TripEditClient({ trip, categories }: { trip: any; categories: Category[] }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    setIsPublishing(true);
    const res = await publishTripAction(trip.id);
    if (res.success) {
      toast.success("Trip published successfully!");
      router.refresh();
    } else {
      toast.error(res.error || "Failed to publish trip");
    }
    setIsPublishing(false);
  };

  const renderTab = () => {
    switch (activeTab) {
      case "overview": return <TripOverviewTab trip={trip} categories={categories} />;
      case "pricing": return <TripPricingTab trip={trip} />;
      case "seo": return <TripSEOTab trip={trip} />;
      case "settings": return <TripSettingsTab trip={trip} />;
      case "faqs": return <TripFAQsTab trip={trip} />;
      case "policies": return <TripPoliciesTab trip={trip} />;
      case "itinerary": return <TripItineraryTab trip={trip} />;
      case "gallery": return <TripGalleryTab trip={trip} />;
      case "analytics": return <PlaceholderTab name="Analytics" />;
      default: return null;
    }
  };

  const getStatusBadge = () => {
    switch (trip.status) {
      case "PUBLISHED": return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-green-100 text-green-800 uppercase tracking-wider">Published</span>;
      case "DRAFT": return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-200 text-gray-800 uppercase tracking-wider">Draft</span>;
      case "ARCHIVED": return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-red-100 text-red-800 uppercase tracking-wider">Archived</span>;
      default: return <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-blue-100 text-blue-800 uppercase tracking-wider">{trip.status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation Bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/trips"
              className="p-2 -ml-2 rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-lg font-bold text-gray-900 truncate max-w-sm">{trip.title}</h1>
                {getStatusBadge()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                slug: <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{trip.slug}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href={`/public/trips/${trip.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Eye className="w-4 h-4" />
              Preview
            </a>
            
            {trip.status !== "PUBLISHED" && (
              <PublishValidator trip={trip} onPublish={handlePublish} isPublishing={isPublishing} />
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 flex gap-6 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-3 px-1 border-b-2 text-sm font-semibold transition-colors whitespace-nowrap ${
                  isActive 
                    ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))]" 
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-8 max-w-5xl mx-auto w-full">
        {renderTab()}
      </div>
    </div>
  );
}
