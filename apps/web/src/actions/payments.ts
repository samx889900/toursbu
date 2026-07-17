"use server";

import { PaymentService } from "@/services/payments";
import { getSession } from "@/lib/auth/server";
import { headers } from "next/headers";

export async function createRazorpayOrderAction(bookingId: string, amount: number, isAdvance: boolean = false) {
  try {
    const session = await getSession();
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const orderData = await PaymentService.createOrder(bookingId, amount, isAdvance);
    return { success: true, data: orderData };
  } catch (error: any) {
    console.error("Failed to create razorpay order:", error);
    return { success: false, error: error.message || "Payment initialization failed" };
  }
}
