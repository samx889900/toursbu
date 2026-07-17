import type { Metadata } from "next";
import { AdminSidebar } from "@/components/layout/sidebar";
import { AdminGlobalSearch } from "@/components/layout/admin-search";

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
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Admin Header */}
        <header className="h-16 border-b bg-white flex items-center px-4 sm:px-6 lg:px-8 justify-between shrink-0">
          <div className="flex-1 max-w-2xl">
            <AdminGlobalSearch />
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
