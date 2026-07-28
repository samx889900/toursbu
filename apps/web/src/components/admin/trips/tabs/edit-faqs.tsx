"use client";

import { useState } from "react";
import { updateTripFAQsAction } from "@/actions/trips";
import { Loader2, Save, Plus, GripVertical, Trash2 } from "lucide-react";
import { toast } from "sonner";

export function TripFAQsTab({ trip }: { trip: any }) {
  const [isSaving, setIsSaving] = useState(false);
  const [faqs, setFaqs] = useState<{ question: string; answer: string; order: number; id: string }[]>(
    (trip.faqs || []).map((f: any, i: number) => ({ ...f, id: f.id || `temp-${i}` }))
  );
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  async function handleSave() {
    setIsSaving(true);
    
    // Clean up temporary IDs and fix order
    const cleanedFaqs = faqs.map((f, idx) => ({
      question: f.question,
      answer: f.answer,
      order: idx,
    }));

    const res = await updateTripFAQsAction(trip.id, cleanedFaqs);
    
    if (res.success) {
      toast.success("FAQs saved successfully!");
    } else {
      toast.error(res.error || "Failed to save FAQs");
    }
    setIsSaving(false);
  }

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: "", answer: "", order: faqs.length, id: `temp-${Date.now()}` }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: "question" | "answer", value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  // HTML5 Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedItemIndex(index);
    // Needed for Firefox
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault(); // Necessary to allow dropping
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    
    // Simple reorder while dragging
    const newFaqs = [...faqs];
    const draggedItem = newFaqs[draggedItemIndex];
    
    newFaqs.splice(draggedItemIndex, 1);
    newFaqs.splice(index, 0, draggedItem);
    
    setDraggedItemIndex(index);
    setFaqs(newFaqs);
  };

  const handleDragEnd = () => {
    setDraggedItemIndex(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">FAQs</h2>
          <p className="text-sm text-gray-500 mt-1">Frequently asked questions about this trip. Drag to reorder.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="px-4 py-2 bg-[hsl(var(--primary))] text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save FAQs
        </button>
      </div>

      <div className="p-6 space-y-4">
        {faqs.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-500">No FAQs added yet.</p>
            <button
              onClick={handleAddFaq}
              className="mt-4 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-colors shadow-sm"
            >
              + Add First FAQ
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={faq.id} 
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex gap-4 p-4 bg-white border border-gray-200 rounded-xl transition-all ${
                  draggedItemIndex === index ? 'opacity-50 ring-2 ring-[hsl(var(--primary))] scale-[0.99]' : ''
                }`}
              >
                <div className="pt-2 cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-900">
                  <GripVertical className="w-5 h-5" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <input
                    type="text"
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, "question", e.target.value)}
                    placeholder="Question (e.g. Is this trip suitable for beginners?)"
                    className="w-full px-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-[hsl(var(--primary))] rounded-lg text-sm font-semibold text-gray-900 transition-all outline-none"
                  />
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
                    placeholder="Answer..."
                    rows={2}
                    className="w-full px-4 py-2 bg-gray-50 border border-transparent focus:bg-white focus:border-[hsl(var(--primary))] rounded-lg text-sm text-gray-700 transition-all outline-none resize-none"
                  />
                </div>
                
                <div className="pt-2">
                  <button
                    onClick={() => handleRemoveFaq(index)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            <button
              onClick={handleAddFaq}
              className="w-full py-4 border-2 border-dashed border-gray-200 rounded-xl text-sm font-semibold text-gray-500 hover:text-gray-900 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add FAQ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
