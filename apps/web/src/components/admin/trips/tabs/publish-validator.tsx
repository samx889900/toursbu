"use client";

import { CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";

export function PublishValidator({ trip, onPublish, isPublishing }: { trip: any, onPublish: () => void, isPublishing: boolean }) {
  
  const rules = [
    { name: "Cover image exists", passed: trip.images?.some((img: any) => img.isCover) },
    { name: "Gallery contains images", passed: trip.images?.length > 0 },
    { name: "Slug exists", passed: !!trip.slug },
    { name: "Itinerary has >= 1 day", passed: trip.days?.length > 0 },
    { name: "Base price is set", passed: !!trip.price },
    { name: "Dates are valid", passed: !!trip.startDate && !!trip.endDate && new Date(trip.startDate) <= new Date(trip.endDate) },
    { name: "Capacity > 0", passed: !!trip.capacity && trip.capacity > 0 },
    { name: "Policies exist", passed: trip.policies?.length > 0 },
    { name: "SEO is complete", passed: !!trip.seoTitle && !!trip.seoDescription },
    { name: "Booking enabled", passed: trip.bookingEnabled },
  ];

  const allPassed = rules.every(r => r.passed);
  const passedCount = rules.filter(r => r.passed).length;

  return (
    <div className="relative group">
      <button
        onClick={onPublish}
        disabled={!allPassed || isPublishing}
        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-sm ${
          allPassed 
            ? "bg-green-600 text-white hover:bg-green-700" 
            : "bg-gray-100 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isPublishing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
        Publish Trip
      </button>

      {/* Validator Dropdown on Hover */}
      <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
          <h4 className="font-bold text-gray-900 text-sm">Publish Checklist</h4>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${allPassed ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
            {passedCount}/{rules.length}
          </span>
        </div>
        <ul className="space-y-2.5">
          {rules.map((rule, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              {rule.passed ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              )}
              <span className={`text-sm ${rule.passed ? "text-gray-600" : "text-gray-900 font-medium"}`}>
                {rule.name}
              </span>
            </li>
          ))}
        </ul>
        {!allPassed && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-start gap-2 text-xs text-orange-600 bg-orange-50 p-2 rounded-lg">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>All checks must pass before this trip can be published.</p>
          </div>
        )}
      </div>
    </div>
  );
}
