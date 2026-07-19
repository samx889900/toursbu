"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createRazorpayOrderAction, verifyRazorpayPaymentAction } from "@/actions/payments";
import { AlertCircle, CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface PaymentCheckoutProps {
  bookingId: string;
  amount: number;
  userName: string;
  userEmail: string;
  userPhone: string;
}

export function PaymentCheckout({ bookingId, amount, userName, userEmail, userPhone }: PaymentCheckoutProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Dynamically load Razorpay SDK
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setIsRazorpayLoaded(true);
    script.onerror = () => toast.error("Failed to load Razorpay payment gateway.");
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handlePayment = async () => {
    if (!isRazorpayLoaded) {
      toast.error("Razorpay SDK not loaded. Please wait.");
      return;
    }

    setIsProcessing(true);

    // 1. Create order on backend
    const res = await createRazorpayOrderAction(bookingId, amount, true);
    if (!res.success || !res.data) {
      toast.error(res.error || "Failed to initialize payment");
      setIsProcessing(false);
      return;
    }

    const { orderId, amount: orderAmount, currency } = res.data;

    // 2. Open Razorpay Checkout Modal
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string, // Use public key from env
      amount: orderAmount.toString(),
      currency,
      name: "ToursBU",
      description: "Trip Advance Payment",
      order_id: orderId,
      handler: async function (response: any) {
        toast.info("Verifying your payment...", { id: "payment_verify" });
        setIsProcessing(true);
        const verifyRes = await verifyRazorpayPaymentAction(
          response.razorpay_order_id,
          response.razorpay_payment_id,
          response.razorpay_signature
        );

        if (verifyRes.success) {
          toast.success("Payment successful and verified!", { id: "payment_verify" });
          router.push(`/bookings/${bookingId}/success`);
        } else {
          toast.error(`Verification failed: ${verifyRes.error}`, { id: "payment_verify" });
          setIsProcessing(false);
        }
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: userPhone,
      },
      theme: {
        color: "#000000",
      },
      modal: {
        ondismiss: function () {
          // User closed the modal before payment
          setIsProcessing(false);
          toast.error("Payment was cancelled.");
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      toast.error(`Payment failed: ${response.error.description}`);
      setIsProcessing(false);
    });
    
    rzp.open();
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 text-center max-w-md mx-auto mt-12 animate-in fade-in zoom-in duration-300">
      <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <CreditCard className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">Secure Payment</h2>
      <p className="text-gray-500 mb-8">Pay the advance amount to confirm your booking and reserve your seats.</p>
      
      <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-8 flex justify-between items-center text-lg">
        <span className="font-semibold text-gray-700">Amount Due</span>
        <span className="font-black text-gray-900">₹{amount.toLocaleString()}</span>
      </div>

      <button 
        onClick={handlePayment}
        disabled={isProcessing || !isRazorpayLoaded}
        className="w-full py-4 bg-black text-white rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay ₹${amount.toLocaleString()} Now`
        )}
      </button>

      <div className="mt-6 flex gap-2 items-start text-left text-xs text-gray-400 bg-gray-50 p-4 rounded-lg">
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <p>Payments are secured by Razorpay. Do not close the window or press back while the transaction is processing.</p>
      </div>
    </div>
  );
}
