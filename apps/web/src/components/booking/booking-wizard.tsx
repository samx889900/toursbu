"use client";

import { useState } from "react";
import { acquireLockAction, createDraftBookingAction } from "@/actions/bookings";
import { Users, AlertCircle, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type WizardStep = "SELECT_COUNT" | "TRAVELER_DETAILS" | "REVIEW" | "DOCUMENTS";

interface BookingWizardProps {
  tripId: string;
  tripTitle: string;
  remainingSeats: number;
  price: number;
  advanceAmount: number;
}

export function BookingWizard({ tripId, tripTitle, remainingSeats, price, advanceAmount }: BookingWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState<WizardStep>("SELECT_COUNT");
  const [travelerCount, setTravelerCount] = useState(1);
  const [isLocking, setIsLocking] = useState(false);
  const [lockId, setLockId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  
  // State for forms
  const [travelers, setTravelers] = useState<any[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<any[]>([]);

  // Step 1: Acquire Lock
  const handleAcquireLock = async () => {
    setIsLocking(true);
    const result = await acquireLockAction(tripId, travelerCount);
    setIsLocking(false);

    if (result.success && result.data) {
      setLockId(result.data.lockId);
      setExpiresAt(new Date(result.data.expiresAt));
      
      // Initialize traveler forms
      const initialTravelers = Array.from({ length: travelerCount }).map((_, i) => ({
        name: "", email: "", phone: "", gender: "MALE", dateOfBirth: "", governmentIdType: "AADHAAR", governmentIdNumber: "", dietaryPreference: null
      }));
      setTravelers(initialTravelers);
      
      setStep("TRAVELER_DETAILS");
      toast.success("Seats reserved for 15 minutes");
    } else {
      toast.error(result.error || "Failed to reserve seats");
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-black text-white p-6 md:p-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black mb-1">{tripTitle}</h2>
          <p className="text-white/70">Complete your booking in a few simple steps</p>
        </div>
        {expiresAt && (
          <div className="hidden md:flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
            <Clock className="w-4 h-4 text-orange-400" />
            <span className="font-medium text-sm">Lock expires at {expiresAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>

      {/* Progress */}
      <div className="flex border-b border-gray-100 overflow-x-auto whitespace-nowrap">
        {(["SELECT_COUNT", "TRAVELER_DETAILS", "REVIEW", "DOCUMENTS"] as WizardStep[]).map((s, index) => {
          const stepLabels = ["Select Seats", "Traveler Info", "Review", "Documents"];
          const isActive = step === s;
          const isPast = ["SELECT_COUNT", "TRAVELER_DETAILS", "REVIEW", "DOCUMENTS"].indexOf(step) > index;
          return (
            <div key={s} className={`flex-1 p-4 px-6 md:px-4 text-center text-sm font-bold border-b-2 transition-colors ${isActive ? "border-black text-black" : isPast ? "border-green-500 text-green-600" : "border-transparent text-gray-400"}`}>
              {index + 1}. {stepLabels[index]}
            </div>
          );
        })}
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 min-h-[400px]">
        
        {step === "SELECT_COUNT" && (
          <div className="max-w-md mx-auto space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">How many people are traveling?</h3>
              <p className="text-gray-500">You can book up to {Math.min(remainingSeats, 10)} seats at once.</p>
            </div>

            <div className="flex items-center justify-center gap-6">
              <button 
                onClick={() => setTravelerCount(Math.max(1, travelerCount - 1))}
                className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 hover:border-black hover:text-black transition-colors"
                disabled={travelerCount <= 1}
              >-</button>
              <div className="text-4xl font-black text-gray-900 w-16 text-center">{travelerCount}</div>
              <button 
                onClick={() => setTravelerCount(Math.min(remainingSeats, 10, travelerCount + 1))}
                className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-2xl font-bold text-gray-600 hover:border-black hover:text-black transition-colors"
                disabled={travelerCount >= Math.min(remainingSeats, 10)}
              >+</button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-blue-800">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p className="text-sm">We will reserve your seats for 15 minutes once you proceed. Please have traveler details ready.</p>
            </div>

            <button 
              onClick={handleAcquireLock}
              disabled={isLocking}
              className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLocking ? "Reserving seats..." : "Continue"}
              {!isLocking && <ChevronRight className="w-5 h-5" />}
            </button>
          </div>
        )}

        {step === "TRAVELER_DETAILS" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="mb-6">
               <h3 className="text-xl font-bold text-gray-900">Traveler Details</h3>
               <p className="text-gray-500">Please provide accurate information as per government IDs.</p>
             </div>
             
             <div className="space-y-8">
               {travelers.map((traveler, index) => (
                 <div key={index} className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                   <h4 className="font-bold text-gray-900 mb-4">{index === 0 ? "Primary Traveler" : `Traveler ${index + 1}`}</h4>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                       <input 
                         type="text"
                         value={traveler.name}
                         onChange={(e) => {
                           const newTravelers = [...travelers];
                           newTravelers[index].name = e.target.value;
                           setTravelers(newTravelers);
                         }}
                         className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                         placeholder="As per Gov ID"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                       <input 
                         type="email"
                         value={traveler.email}
                         onChange={(e) => {
                           const newTravelers = [...travelers];
                           newTravelers[index].email = e.target.value;
                           setTravelers(newTravelers);
                         }}
                         className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                       <input 
                         type="tel"
                         value={traveler.phone}
                         onChange={(e) => {
                           const newTravelers = [...travelers];
                           newTravelers[index].phone = e.target.value;
                           setTravelers(newTravelers);
                         }}
                         className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                         required
                       />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                       <select 
                         value={traveler.gender}
                         onChange={(e) => {
                           const newTravelers = [...travelers];
                           newTravelers[index].gender = e.target.value;
                           setTravelers(newTravelers);
                         }}
                         className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none bg-white"
                       >
                         <option value="MALE">Male</option>
                         <option value="FEMALE">Female</option>
                         <option value="OTHER">Other</option>
                       </select>
                     </div>
                   </div>
                 </div>
               ))}

               <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                 <h4 className="font-bold text-gray-900 mb-4">Emergency Contact</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Contact Name</label>
                     <input 
                       type="text"
                       value={emergencyContacts[0]?.name || ""}
                       onChange={(e) => setEmergencyContacts([{ ...emergencyContacts[0], name: e.target.value }])}
                       className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone</label>
                     <input 
                       type="tel"
                       value={emergencyContacts[0]?.phone || ""}
                       onChange={(e) => setEmergencyContacts([{ ...emergencyContacts[0], phone: e.target.value }])}
                       className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                       required
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                     <input 
                       type="text"
                       value={emergencyContacts[0]?.relation || ""}
                       onChange={(e) => setEmergencyContacts([{ ...emergencyContacts[0], relation: e.target.value }])}
                       className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black outline-none"
                       placeholder="e.g. Father, Sister"
                       required
                     />
                   </div>
                 </div>
               </div>

               <div className="flex justify-end gap-4">
                 <button 
                   onClick={() => setStep("REVIEW")}
                   className="px-8 py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-colors"
                 >
                   Continue to Summary
                 </button>
               </div>
             </div>
          </div>
        )}

        {step === "REVIEW" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Review & Summary</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 border-b pb-2">Travelers</h4>
                  <ul className="space-y-2">
                    {travelers.map((t, i) => (
                      <li key={i} className="flex justify-between text-sm">
                        <span>{t.name}</span>
                        <span className="text-gray-500">{t.email}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 border-b pb-2">Emergency Contact</h4>
                  <p className="text-sm">{emergencyContacts[0]?.name} ({emergencyContacts[0]?.relation}) - {emergencyContacts[0]?.phone}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 h-fit">
                <h4 className="font-bold text-gray-900 mb-4 border-b border-gray-200 pb-2">Price Breakdown</h4>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between text-gray-600">
                    <span>Base Price (₹{price.toLocaleString()} x {travelerCount})</span>
                    <span>₹{(price * travelerCount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Taxes & Fees</span>
                    <span>Included</span>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total Amount</span>
                    <span>₹{(price * travelerCount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="bg-orange-50 text-orange-800 p-4 rounded-xl border border-orange-100 flex justify-between font-bold">
                  <span>Advance to Pay Now</span>
                  <span>₹{(advanceAmount * travelerCount).toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <button 
                onClick={() => setStep("TRAVELER_DETAILS")}
                className="px-6 py-3 text-gray-600 font-medium hover:text-black transition-colors"
                disabled={isLocking}
              >
                Back to Details
              </button>
              
              <button 
                onClick={async () => {
                  setIsLocking(true);
                  const result = await createDraftBookingAction({
                    tripId,
                    travelerCount,
                    totalAmount: price * travelerCount,
                    advanceAmount: advanceAmount * travelerCount,
                    travelers,
                    emergencyContacts,
                    lockId: lockId || undefined,
                  });
                  setIsLocking(false);

                  if (result.success && result.data) {
                    toast.success("Booking draft created!");
                    setBookingId(result.data.id);
                    // Fetch traveler IDs to map for document upload
                    setTravelers(result.data.travelers);
                    setStep("DOCUMENTS");
                  } else {
                    toast.error(result.error || "Failed to create booking");
                  }
                }}
                disabled={isLocking}
                className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 disabled:opacity-50"
              >
                {isLocking ? "Processing..." : `Pay ₹${(advanceAmount * travelerCount).toLocaleString()} Advance`}
              </button>
            </div>
          </div>
        )}

      {step === "DOCUMENTS" && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Government ID</h3>
            <p className="text-gray-500 mb-6">Please upload a valid Aadhar card or Passport for each traveler.</p>
            
            <div className="space-y-6 mb-8">
              {travelers.map((t, index) => (
                <div key={t.id || index} className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900">{t.name}</h4>
                    <p className="text-sm text-gray-500">{t.governmentIdType}: {t.governmentIdNumber}</p>
                  </div>
                  <div>
                    <input 
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append("bookingId", bookingId!);
                        formData.append("travelerId", t.id);
                        formData.append("type", t.governmentIdType);
                        
                        const loadingToast = toast.loading(`Uploading for ${t.name}...`);
                        try {
                          const res = await fetch("/api/documents/upload", {
                            method: "POST",
                            body: formData,
                          });
                          const data = await res.json();
                          if (data.success) {
                            toast.success(`Uploaded successfully`, { id: loadingToast });
                            // Mark this traveler as having uploaded (could save to local state to show a checkmark)
                            const updated = [...travelers];
                            updated[index].uploaded = true;
                            setTravelers(updated);
                          } else {
                            toast.error(data.error || "Upload failed", { id: loadingToast });
                          }
                        } catch (err) {
                          toast.error("Network error during upload", { id: loadingToast });
                        }
                      }}
                      className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
                    />
                    {t.uploaded && <CheckCircle2 className="w-5 h-5 text-green-500 inline-block ml-2" />}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-6">
              <button 
                onClick={() => {
                  toast.info("You can upload documents later from your dashboard.");
                  router.push(`/trips/${tripId}/book/payment?bookingId=${bookingId}`);
                }}
                className="px-6 py-3 text-gray-600 font-medium hover:text-black transition-colors"
              >
                Skip for now
              </button>
              
              <button 
                onClick={() => {
                  router.push(`/trips/${tripId}/book/payment?bookingId=${bookingId}`);
                }}
                className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
