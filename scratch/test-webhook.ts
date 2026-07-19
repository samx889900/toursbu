import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();
const RAZORPAY_WEBHOOK_SECRET = "dummy_webhook_secret_123";

async function run() {
  console.log("=== Testing End-to-End Booking & Webhook Flow ===");

  // 1. Get a Trip
  const trip = await prisma.trip.findFirst({
    where: { status: "PUBLISHED" },
  });
  if (!trip) throw new Error("No trip found");
  
  // 2. Get a User
  let user = await prisma.user.findFirst({
    where: { email: "test.webhook@example.com" },
  });
  if (!user) {
    user = await prisma.user.create({
      data: {
        email: "test.webhook@example.com",
        name: "Webhook Tester",
        role: "USER",
        onboardingCompleted: true,
        phone: "1234567890",
        emailVerified: true,
      }
    });
  }

  // 3. Create a DRAFT Booking
  const booking = await prisma.booking.create({
    data: {
      userId: user.id,
      tripId: trip.id,
      bookingNumber: `BKG-TEST-${Date.now()}`,
      status: "DRAFT",
      travelerCount: 1,
      totalAmount: trip.price,
      advanceAmount: trip.advanceAmount,
      amountPaid: 0,
      travelers: {
        create: [
          {
            name: user.name,
            email: user.email,
            phone: user.phone || "1234567890",
            gender: "MALE",
            isPrimary: true,
          }
        ]
      }
    }
  });

  console.log(`[1] Created Booking: ${booking.id} (${booking.status})`);

  // 4. Create PaymentAttempt (Simulating PaymentService.createOrder)
  const attempt = await prisma.paymentAttempt.create({
    data: {
      bookingId: booking.id,
      razorpayOrderId: `order_test_${Date.now()}`,
      amount: trip.advanceAmount,
      status: "CREATED",
    }
  });
  
  await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "PENDING_PAYMENT" },
  });

  console.log(`[2] Created Payment Attempt: ${attempt.razorpayOrderId} for Booking (${booking.status} -> PENDING_PAYMENT)`);

  // 5. Simulate Webhook
  const payload = {
    event: "payment.captured",
    payload: {
      payment: {
        entity: {
          id: `pay_test_${Date.now()}`,
          order_id: attempt.razorpayOrderId,
          amount: attempt.amount * 100, // in paise
          currency: "INR",
          status: "captured"
        }
      }
    }
  };

  const payloadString = JSON.stringify(payload);
  const signature = crypto.createHmac("sha256", RAZORPAY_WEBHOOK_SECRET).update(payloadString).digest("hex");

  console.log(`[3] POSTing to Webhook Endpoint...`);
  
  const res = await fetch("http://localhost:3000/api/webhooks/razorpay", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-razorpay-signature": signature,
      "x-razorpay-event-id": `evt_test_${Date.now()}`
    },
    body: payloadString,
  });

  const resData = await res.json();
  console.log(`[4] Webhook Response: ${res.status}`, resData);

  // 6. Verify Final DB State
  const finalBooking = await prisma.booking.findUnique({
    where: { id: booking.id },
    include: {
      payments: true,
      events: true,
      receipts: true,
      invoices: true,
    }
  });

  console.log(`[5] Final Booking Status: ${finalBooking?.status}`);
  console.log(`[6] Payments Recorded: ${finalBooking?.payments.length}`);
  console.log(`[7] Receipts Generated: ${finalBooking?.receipts.length}`);
  console.log(`[8] Events Logged: ${finalBooking?.events.length}`);

  if (finalBooking?.status === "CONFIRMED") {
    console.log("✅ Webhook Flow Completed Successfully!");
  } else {
    console.error("❌ Webhook Flow Failed - Booking not CONFIRMED.");
  }
}

run().catch(console.error);
