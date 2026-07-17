import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/server";
import { CheckCircle2, Circle, ArrowRight, Download, Calendar as CalendarIcon, MessageCircle } from "lucide-react";
import Link from "next/link";
import { BookingStatus } from "@prisma/client";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookingSuccessPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();

  if (!session?.user) {
    redirect(`/login?callbackUrl=/bookings/${id}/success`);
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { 
      trip: true,
      checklistItems: {
        orderBy: { order: 'asc' }
      },
      invoices: true
    },
  });

  if (!booking || booking.userId !== session.user.id) {
    notFound();
  }

  if (booking.status === BookingStatus.DRAFT) {
    redirect(`/trips/${booking.trip.slug}/book/payment?bookingId=${booking.id}`);
  }

  const isConfirmed = booking.status === BookingStatus.CONFIRMED;
  const receipt = booking.invoices.find(inv => inv.pdfUrl !== null);

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          
          <div className="bg-black text-white p-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-black mb-2">Booking Confirmed!</h1>
              <p className="text-gray-300 text-lg max-w-lg mx-auto">
                You're going to {booking.trip.title}. Your adventure awaits.
              </p>
              <div className="mt-6 inline-flex bg-white/10 px-4 py-2 rounded-lg font-mono text-sm tracking-widest border border-white/20">
                BOOKING ID: {booking.bookingNumber}
              </div>
            </div>
          </div>

          <div className="p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Journey Tracker</h2>
            
            <div className="space-y-6">
              {/* Static Initial Steps */}
              <div className="flex gap-4">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-green-500" /></div>
                <div>
                  <h3 className="font-bold text-gray-900 line-through decoration-2 decoration-green-500/30">Booking Created</h3>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-green-500" /></div>
                <div>
                  <h3 className="font-bold text-gray-900 line-through decoration-2 decoration-green-500/30">Advance Payment Received</h3>
                  <p className="text-sm text-gray-500 mt-1">₹{booking.amountPaid.toLocaleString()} paid successfully.</p>
                </div>
              </div>

              {receipt && (
                <div className="flex gap-4">
                  <div className="mt-1"><CheckCircle2 className="w-6 h-6 text-green-500" /></div>
                  <div>
                    <h3 className="font-bold text-gray-900 line-through decoration-2 decoration-green-500/30">Receipt Generated</h3>
                    <a href={receipt.pdfUrl!} target="_blank" className="text-blue-600 text-sm font-semibold mt-1 flex items-center gap-1 hover:underline">
                      <Download className="w-3 h-3" /> Download Receipt
                    </a>
                  </div>
                </div>
              )}

              {/* Dynamic Checklist Steps */}
              {booking.checklistItems.filter(item => item.title !== "Advance Payment Completed").map((item, idx) => (
                <div key={item.id} className="flex gap-4 opacity-100">
                  <div className="mt-1">
                    {item.completed ? (
                      <CheckCircle2 className="w-6 h-6 text-green-500" />
                    ) : (
                      <Circle className="w-6 h-6 text-gray-300" />
                    )}
                  </div>
                  <div>
                    <h3 className={`font-bold ${item.completed ? 'text-gray-900 line-through decoration-2 decoration-green-500/30' : 'text-gray-900'}`}>
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
              
              <div className="flex gap-4">
                <div className="mt-1"><Circle className="w-6 h-6 text-gray-300" /></div>
                <div>
                  <h3 className="font-bold text-gray-900">Trip Starts in {Math.max(0, Math.ceil(((booking.trip.startDate?.getTime() || Date.now()) - Date.now()) / (1000 * 60 * 60 * 24)))} Days</h3>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row gap-4">
              <Link 
                href="/dashboard"
                className="flex-1 py-4 bg-gray-100 text-gray-900 rounded-xl font-bold text-center hover:bg-gray-200 transition-colors"
              >
                Go to Dashboard
              </Link>
              <Link 
                href={`/trips/${booking.trip.slug}`}
                className="flex-1 py-4 bg-black text-white rounded-xl font-bold text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
              >
                View Trip Details <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
