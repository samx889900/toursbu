"use client";

import { useState } from "react";
import { updateTripPricingAction } from "@/actions/trips";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export function TripPricingTab({ trip }: { trip: any }) {
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await updateTripPricingAction(trip.id, formData);
    
    if (res.success) {
      toast.success("Pricing saved successfully!");
    } else {
      toast.error(res.error || "Failed to save pricing");
    }
    setIsSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Trip Pricing</h2>
          <p className="text-sm text-gray-500 mt-1">Configure base prices, advances, and discounts.</p>
        </div>
        <button
          type="submit"
          disabled={isSaving}
          className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Pricing
        </button>
      </div>

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Base Price (₹) *</label>
            <input 
              type="number" 
              name="price" 
              defaultValue={trip.price || ""}
              required
              min="0"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Advance Amount (₹)</label>
            <input 
              type="number" 
              name="advanceAmount" 
              defaultValue={trip.advanceAmount || ""}
              min="0"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
            />
            <p className="text-xs text-gray-500 mt-1.5">Amount required to lock the booking.</p>
          </div>
          
          <div className="pt-4 border-t border-gray-100 md:col-span-2">
            <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Discounts & Taxes</h3>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Early Bird Price (₹)</label>
            <input 
              type="number" 
              name="earlyBirdPrice" 
              defaultValue={trip.earlyBirdPrice || ""}
              min="0"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Group Discount per person (₹)</label>
            <input 
              type="number" 
              name="groupDiscountAmount" 
              defaultValue={trip.groupDiscountAmount || ""}
              min="0"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
            />
          </div>

          <div className="md:col-span-2 flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <input 
              type="checkbox"
              id="gstEnabled"
              name="gstEnabled"
              value="true"
              defaultChecked={trip.gstEnabled}
              className="w-5 h-5 rounded border-gray-300 text-[hsl(var(--primary))] focus:ring-[hsl(var(--primary))]"
            />
            <div>
              <label htmlFor="gstEnabled" className="font-semibold text-sm text-gray-900">Enable 5% GST Collection</label>
              <p className="text-xs text-gray-500">If enabled, 5% GST will be added on top of the base price during checkout.</p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
