import { getAdminSession } from "@/lib/auth/admin-session";
import { redirect } from "next/navigation";
import { TripService } from "@/services/trips";
import { TripsClient } from "./client";
import { TripStatus } from "@prisma/client";

export default async function AdminTripsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getAdminSession();
  if (!session) {
    redirect("/admin/login");
  }

  const query = typeof searchParams.query === "string" ? searchParams.query : undefined;
  const status = typeof searchParams.status === "string" ? (searchParams.status as TripStatus) : undefined;
  const isArchived = searchParams.isArchived === "true" ? true : searchParams.isArchived === "false" ? false : undefined;
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const orderBy = typeof searchParams.orderBy === "string" ? (searchParams.orderBy as any) : "newest";

  const { trips, total, totalPages } = await TripService.searchTrips({
    query,
    status,
    isArchived,
    page,
    limit: 10,
    orderBy,
  });

  return (
    <TripsClient 
      trips={trips as any} 
      total={total} 
      totalPages={totalPages} 
      currentPage={page} 
      searchParams={searchParams}
    />
  );
}
