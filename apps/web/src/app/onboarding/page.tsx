"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { completeOnboarding } from "./actions";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await completeOnboarding(formData);

    if (result.success) {
      // Reload the page to ensure the new session state (onboardingCompleted=true) is picked up by middleware
      window.location.href = "/dashboard";
    } else {
      setError(result.error || "An unknown error occurred");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--tbu-parchment)] p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8 animate-in fade-in zoom-in duration-300">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome to ToursBU</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Let&apos;s get your profile set up so you can start booking trips.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                required
                placeholder="+91 99999 99999"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="college" className="block text-sm font-medium text-gray-700 mb-1">
                College / University
              </label>
              <input
                type="text"
                name="college"
                id="college"
                required
                placeholder="e.g. IIT Bombay"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
            </div>

            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-1">
                Emergency Contact Phone
              </label>
              <input
                type="tel"
                name="emergencyContact"
                id="emergencyContact"
                required
                placeholder="+91 88888 88888"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
              />
              <p className="text-xs text-gray-400 mt-1">
                We&apos;ll only use this if there&apos;s an emergency during a trip.
              </p>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              "Complete Setup"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
