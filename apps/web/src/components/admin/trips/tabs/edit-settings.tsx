"use client";

import { useState } from "react";
import { updateTripSettingsAction, archiveTripAction, restoreTripAction } from "@/actions/trips";
import { Loader2, Save, Archive, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function TripSettingsTab({ trip }: { trip: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await updateTripSettingsAction(trip.id, formData);
    
    if (res.success) {
      toast.success("Settings saved successfully!");
    } else {
      toast.error(res.error || "Failed to save settings");
    }
    setIsSaving(false);
  }

  async function handleArchiveToggle() {
    setIsSaving(true);
    if (trip.isArchived) {
      const res = await restoreTripAction(trip.id);
      if (res.success) {
        toast.success("Trip restored!");
        router.refresh();
      } else toast.error(res.error);
    } else {
      const res = await archiveTripAction(trip.id);
      if (res.success) {
        toast.success("Trip archived!");
        router.refresh();
      } else toast.error(res.error);
    }
    setIsSaving(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Trip Settings</h2>
              <p className="text-sm text-gray-500 mt-1">Manage visibility, dates, and booking behavior.</p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Settings
            </button>
          </div>

          <div className="p-6 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Visibility</label>
                <select 
                  name="visibility" 
                  defaultValue={trip.visibility || "PUBLIC"}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all bg-white"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private (Link Only)</option>
                  <option value="HIDDEN">Hidden</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Capacity (Max Travelers)</label>
                <input 
                  type="number" 
                  name="capacity" 
                  defaultValue={trip.capacity || ""}
                  min="1"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Start Date</label>
                <input 
                  type="date" 
                  name="startDate" 
                  defaultValue={trip.startDate ? new Date(trip.startDate).toISOString().split('T')[0] : ""}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all text-gray-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">End Date</label>
                <input 
                  type="date" 
                  name="endDate" 
                  defaultValue={trip.endDate ? new Date(trip.endDate).toISOString().split('T')[0] : ""}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all text-gray-700"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Booking Deadline</label>
                <input 
                  type="datetime-local" 
                  name="bookingDeadline" 
                  defaultValue={trip.bookingDeadline ? new Date(trip.bookingDeadline).toISOString().slice(0,16) : ""}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all text-gray-700"
                />
                <p className="text-xs text-gray-500 mt-1">Bookings will automatically close after this date.</p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 space-y-4">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Feature Toggles</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Enable Bookings</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Allow users to book this trip (Requires PUBLISHED status).</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="bookingEnabled" value="true" defaultChecked={trip.bookingEnabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(var(--primary)/0.2)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--primary))]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h4 className="text-sm font-bold text-gray-900">Enable Waitlist</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Allow users to join a waitlist when capacity is full.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="waitlistEnabled" value="true" defaultChecked={trip.waitlistEnabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[hsl(var(--primary)/0.2)] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[hsl(var(--primary))]"></div>
                </label>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
          <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-2">Danger Zone</h3>
          <p className="text-xs text-red-700 mb-6">
            {trip.isArchived 
              ? "This trip is currently archived and hidden from all public interfaces."
              : "Archiving this trip will hide it from the public and prevent new bookings."}
          </p>
          <button
            type="button"
            onClick={handleArchiveToggle}
            disabled={isSaving}
            className="w-full flex justify-center items-center gap-2 px-4 py-2.5 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {trip.isArchived ? (
              <>
                <RefreshCw className="w-4 h-4" /> Restore Trip
              </>
            ) : (
              <>
                <Archive className="w-4 h-4" /> Archive Trip
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
