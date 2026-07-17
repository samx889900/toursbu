import { PageHeader } from "@/components/shared/page-header";
import { Download, FileSpreadsheet, Users, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Exports"
        description="Download CSV extracts for analysis and offline processing."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Reports" },
        ]}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Bookings Report */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-start gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
            <FileSpreadsheet className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Master Bookings</h3>
            <p className="text-sm text-gray-500 mt-1">Export all bookings with user details, trip info, statuses, and payment progress.</p>
          </div>
          <Button asChild className="w-full mt-auto" variant="outline">
            <a href="/api/admin/export?type=bookings" download>
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </a>
          </Button>
        </div>

        {/* Travelers Report */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-start gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Travelers Directory</h3>
            <p className="text-sm text-gray-500 mt-1">Export all travelers, including emergency contacts, allocations, and preferences.</p>
          </div>
          <Button asChild className="w-full mt-auto" variant="outline">
            <a href="/api/admin/export?type=travelers" download>
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </a>
          </Button>
        </div>

        {/* Financial Report */}
        <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col items-start gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">Revenue & Payments</h3>
            <p className="text-sm text-gray-500 mt-1">Export all payment transactions, including methods, statuses, and timestamps.</p>
          </div>
          <Button asChild className="w-full mt-auto" variant="outline">
            <a href="/api/admin/export?type=revenue" download>
              <Download className="w-4 h-4 mr-2" /> Download CSV
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
