"use client";

import { useState } from "react";
import { UploadCloud, Image as ImageIcon, FileText, Loader2 } from "lucide-react";

import { use } from "react";

export default function TripImagesEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  
  // Real implementation will use the StorageService via a Server Action
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingCover(true);
    // Mocking the upload delay for this milestone UI, real logic goes to StorageService
    setTimeout(() => {
      setCoverUrl(URL.createObjectURL(file));
      setIsUploadingCover(false);
    }, 1500);
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Cover Image Section */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Cover Image</h2>
          <p className="text-sm text-gray-500 mt-1">This is the main image displayed on the explore page cards.</p>
        </div>

        <div className="p-6">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-gray-50 transition-colors relative overflow-hidden group">
            {coverUrl ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverUrl} alt="Cover" className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 flex items-center justify-center">
                  <span className="text-white font-medium">Change Cover</span>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  {isUploadingCover ? (
                    <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
                  ) : (
                    <UploadCloud className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <h3 className="text-sm font-semibold text-gray-900">Upload a cover image</h3>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG or WebP up to 5MB</p>
              </>
            )}
            
            <input 
              type="file" 
              accept="image/*"
              onChange={handleCoverUpload}
              disabled={isUploadingCover}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" 
            />
          </div>
        </div>
      </div>

      {/* Brochure Section */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Trip Brochure</h2>
          <p className="text-sm text-gray-500 mt-1">Upload a PDF brochure that students can download.</p>
        </div>

        <div className="p-6">
          <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900">No brochure uploaded</h3>
              <p className="text-xs text-gray-500">Upload a PDF file up to 10MB.</p>
            </div>
            <button className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
              Upload PDF
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
