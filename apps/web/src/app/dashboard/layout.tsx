import { Metadata } from "next";
import { StudentNav } from "@/components/layout/student-nav";

export const metadata: Metadata = {
  title: "Dashboard | ToursBU",
  description: "Manage your trips, payments, and profile.",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-[var(--tbu-canvas)]">
      <StudentNav />
      
      <main className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 pb-24 md:pb-12">
        {children}
      </main>
    </div>
  );
}
