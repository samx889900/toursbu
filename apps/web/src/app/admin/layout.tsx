import type { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/sidebar";

export const metadata: Metadata = {
  title: "Admin · ToursBU",
  description: "ToursBU admin operations center.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[hsl(var(--background))]">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
