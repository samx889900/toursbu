"use client";

import { useState } from "react";
import { updateTripSEOAction } from "@/actions/trips";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";

export function TripSEOTab({ trip }: { trip: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [seoTitle, setSeoTitle] = useState(trip.seoTitle || trip.title);
  const [seoDesc, setSeoDesc] = useState(trip.seoDescription || trip.shortDesc || "");

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const res = await updateTripSEOAction(trip.id, formData);
    
    if (res.success) {
      toast.success("SEO saved successfully!");
    } else {
      toast.error(res.error || "Failed to save SEO");
    }
    setIsSaving(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <form onSubmit={handleSave} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">SEO Meta</h2>
              <p className="text-sm text-gray-500 mt-1">Manage how this trip appears on search engines.</p>
            </div>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save SEO
            </button>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Title</label>
              <input 
                type="text" 
                name="seoTitle" 
                value={seoTitle}
                onChange={e => setSeoTitle(e.target.value)}
                maxLength={60}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
              <p className="text-xs text-gray-500 mt-1.5 text-right">{seoTitle.length} / 60</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Description</label>
              <textarea 
                name="seoDescription" 
                value={seoDesc}
                onChange={e => setSeoDesc(e.target.value)}
                rows={3}
                maxLength={160}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all resize-none"
              />
              <p className="text-xs text-gray-500 mt-1.5 text-right">{seoDesc.length} / 160</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Meta Keywords</label>
              <input 
                type="text" 
                name="seoKeywords" 
                defaultValue={trip.seoKeywords || ""}
                placeholder="manali, trek, snow, himachal"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Canonical URL Override (Optional)</label>
              <input 
                type="url" 
                name="canonicalUrl" 
                defaultValue={trip.canonicalUrl || ""}
                placeholder="https://toursbu.com/trips/custom-slug"
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[hsl(var(--primary))] transition-all"
              />
            </div>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden p-6">
          <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Search Preview</h3>
          
          <div className="bg-white p-4 border border-gray-100 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.1)]">
            <div className="flex gap-3 mb-2">
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs">🌐</div>
              <div>
                <div className="text-sm text-gray-900 font-medium">ToursBU</div>
                <div className="text-xs text-gray-500">https://toursbu.com/trips/{trip.slug}</div>
              </div>
            </div>
            <div className="text-[20px] text-[#1a0dab] cursor-pointer hover:underline truncate mb-1">
              {seoTitle || trip.title}
            </div>
            <div className="text-[14px] text-[#4d5156] line-clamp-2 leading-[1.58]">
              {seoDesc || trip.shortDesc || "No description provided."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
