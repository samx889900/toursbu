import { NextRequest, NextResponse } from "next/server";
import { PaymentService } from "@/services/payments";

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    if (!signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    // 1. Verify Signature
    const isValid = PaymentService.verifyWebhookSignature(body, signature);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const payload = JSON.parse(body);
    const eventId = req.headers.get("x-razorpay-event-id") || payload.event_id || `evt_${Date.now()}`;
    const eventType = payload.event;

    // 2. Store payload permanently
    await PaymentService.storeWebhookEvent(eventId, eventType, payload);

    // 3. Process the event based on type
    if (eventType === "payment.captured" || eventType === "order.paid") {
      const result = await PaymentService.processPaymentSuccess(payload);
      
      if (result.status === "already_processed") {
        return NextResponse.json({ status: "already_processed" });
      }

      await PaymentService.markWebhookProcessed(eventId);
      return NextResponse.json({ status: "success", bookingId: result.bookingId });
    }

    if (eventType === "payment.failed") {
      const result = await PaymentService.processPaymentFailure(payload);
      
      if (result.status === "already_processed") {
        return NextResponse.json({ status: "already_processed" });
      }

      await PaymentService.markWebhookProcessed(eventId);
      return NextResponse.json({ status: "success", bookingId: result.bookingId });
    }

    // Unhandled event types are safely ignored (but stored)
    return NextResponse.json({ status: "ignored" });

  } catch (error: any) {
    console.error("Webhook processing error:", error);
    // Returning 200 even on error prevents Razorpay from aggressively retrying immediately, 
    // but since we want DLQ/Replays, returning 500 will make Razorpay retry. 
    // According to Ponytail, just throw it so we can track it, or handle it based on business rules.
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
