import { getAdminSession } from "@/lib/auth/admin-session";
import { redirect } from "next/navigation";
import { CreateTripClient } from "./client";
import { prisma } from "@/lib/prisma";

export default async function AdminCreateTripPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const categories = await prisma.category.findMany({
    orderBy: { order: "asc" }
  });

  return <CreateTripClient categories={categories} />;
}
