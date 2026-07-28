"use client";

import { useState, useRef } from "react";
import { updateTripGalleryAction } from "@/actions/trips";
import { Loader2, Save, UploadCloud, X, Star, GripVertical, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

export function TripGalleryTab({ trip }: { trip: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [images, setImages] = useState<any[]>(
    (trip.images || []).map((img: any, i: number) => ({ ...img, id: img.id || `img-${i}` }))
  );
  
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSave() {
    setIsSaving(true);
    
    // Ensure at least one image is cover if any exist
    let hasCover = images.some(img => img.isCover);
    if (!hasCover && images.length > 0) {
      images[0].isCover = true;
    }

    const cleanedImages = images.map((img, idx) => ({
      url: img.url,
      isCover: !!img.isCover,
      order: idx,
      altText: img.altText || "",
    }));

    const res = await updateTripGalleryAction(trip.id, cleanedImages);
    
    if (res.success) {
      toast.success("Gallery saved successfully!");
    } else {
      toast.error(res.error || "Failed to save gallery");
    }
    setIsSaving(false);
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    const removed = newImages.splice(index, 1)[0];
    
    // If we removed the cover, make the first one cover (if any left)
    if (removed.isCover && newImages.length > 0) {
      newImages[0].isCover = true;
    }
    
    setImages(newImages);
  };

  const handleSetCover = (index: number) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isCover: i === index
    }));
    setImages(newImages);
  };

  const handleAltTextChange = (index: number, text: string) => {
    const newImages = [...images];
    newImages[index].altText = text;
    setImages(newImages);
  };

  // Mock Upload function since real Supabase upload requires configured client
  const simulateUpload = (file: File) => {
    return new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTimeout(() => {
          resolve(reader.result as string); // Using Data URL as mock URL
        }, 1000);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    const newUploads = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (newUploads.length === 0) return;

    toast.info(`Uploading ${newUploads.length} image(s)...`);
    
    const uploadedImages: any[] = [];
    for (const file of newUploads) {
      const url = await simulateUpload(file);
      uploadedImages.push({
        id: `img-${Date.now()}-${Math.random()}`,
        url,
        isCover: false, // Default to false, logic in handleSave handles fallback
        order: images.length + uploadedImages.length,
        altText: file.name
      });
    }

    setImages(prev => [...prev, ...uploadedImages]);
    toast.success("Upload complete!");
  };

  // HTML5 File Drag & Drop Handlers
  const onFileDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };
  const onFileDragLeave = () => setIsDraggingFile(false);
  const onFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  // HTML5 Image Reorder Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newImages = [...images];
    const draggedItem = newImages[draggedItemIndex];
    newImages.splice(draggedItemIndex, 1);
    newImages.splice(index, 0, draggedItem);
    setDraggedItemIndex(index);
    setImages(newImages);
  };
  const handleDragEnd = () => setDraggedItemIndex(null);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Trip Gallery</h2>
          <p className="text-sm text-gray-500 mt-1">Upload images, set the cover photo, and drag to reorder.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Gallery
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Upload Zone */}
        <div
          onDragOver={onFileDragOver}
          onDragLeave={onFileDragLeave}
          onDrop={onFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all flex flex-col items-center justify-center ${
            isDraggingFile 
              ? "border-[hsl(var(--primary))] bg-[hsl(var(--primary)/0.05)]" 
              : "border-gray-200 bg-gray-50 hover:bg-gray-100 hover:border-gray-300"
          }`}
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4">
            <UploadCloud className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">Click or drag images to upload</h3>
          <p className="text-sm text-gray-500">Supported formats: JPG, PNG, WEBP (Max 5MB each)</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files && handleFiles(e.target.files)} 
            multiple 
            accept="image/*" 
            className="hidden" 
          />
        </div>

        {/* Gallery Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((img, index) => (
              <div
                key={img.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm transition-all ${
                  draggedItemIndex === index ? 'opacity-50 ring-2 ring-[hsl(var(--primary))] scale-95' : ''
                }`}
              >
                {/* Image Preview */}
                <div className="aspect-[4/3] relative bg-gray-100 border-b border-gray-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                  
                  {/* Cover Badge */}
                  {img.isCover && (
                    <div className="absolute top-2 left-2 bg-[hsl(var(--primary))] text-white text-xs font-bold px-2 py-1 rounded-md flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current" /> Cover
                    </div>
                  )}

                  {/* Hover Overlay Controls */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <div className="cursor-grab active:cursor-grabbing p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-sm transition-colors">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    {!img.isCover && (
                      <button
                        onClick={() => handleSetCover(index)}
                        className="p-2 bg-white/20 hover:bg-white/40 rounded-lg text-white backdrop-blur-sm transition-colors"
                        title="Set as Cover"
                      >
                        <Star className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white backdrop-blur-sm transition-colors"
                      title="Remove"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {/* Image Details */}
                <div className="p-3">
                  <input
                    type="text"
                    value={img.altText || ""}
                    onChange={(e) => handleAltTextChange(index, e.target.value)}
                    placeholder="Alt text / Caption"
                    className="w-full px-2 py-1.5 bg-gray-50 border border-transparent focus:bg-white focus:border-[hsl(var(--primary))] rounded-lg text-xs text-gray-700 transition-all outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
