import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { AdminBookingClient } from "./client";

export default async function AdminBookingPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const booking = await prisma.booking.findUnique({
    where: { id: params.id },
    include: {
      user: true,
      trip: true,
      travelers: {
        include: { 
          roomAllocation: { include: { room: true } }, 
          busAllocation: { include: { bus: true } },
          documents: true
        }
      },
      emergencyContacts: true,
      payments: { orderBy: { createdAt: "desc" } },
      events: { orderBy: { createdAt: "desc" } },
      notes: { orderBy: { createdAt: "desc" } },
      invoices: true,
      receipts: true,
    }
  });

  if (!booking) notFound();

  return <AdminBookingClient booking={booking} />;
}
