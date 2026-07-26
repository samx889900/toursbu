"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  ShieldCheck,
  UserPlus,
  MoreHorizontal,
  Power,
  Trash2,
  Loader2,
} from "lucide-react";

interface AdminItem {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

const roleBadgeColor: Record<string, string> = {
  SUPER_ADMIN: "bg-purple-100 text-purple-700",
  ADMIN: "bg-blue-100 text-blue-700",
  OPERATIONS_ADMIN: "bg-amber-100 text-amber-700",
  CONTENT_ADMIN: "bg-green-100 text-green-700",
  SUPPORT_ADMIN: "bg-cyan-100 text-cyan-700",
};

export default function AdminManagementPage() {
  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const res = await fetch("/api/admin/admins");
      if (!res.ok) throw new Error("Failed to fetch");
      setAdmins(await res.json());
    } catch {
      toast.error("Failed to load admins");
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (admin: AdminItem) => {
    if (admin.role === "SUPER_ADMIN") {
      toast.error("Cannot modify a SUPER_ADMIN account");
      return;
    }
    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !admin.isActive }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success(
        admin.isActive ? `${admin.fullName} disabled` : `${admin.fullName} enabled`
      );
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.message || "Failed to update admin");
    }
  };

  const deleteAdmin = async (admin: AdminItem) => {
    if (admin.role === "SUPER_ADMIN") {
      toast.error("Cannot delete a SUPER_ADMIN account");
      return;
    }
    if (!confirm(`Delete ${admin.fullName} (${admin.email})? This cannot be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error);
      }
      toast.success(`${admin.fullName} deleted`);
      fetchAdmins();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete admin");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-[hsl(var(--primary))]" />
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Management</h1>
            <p className="text-sm text-gray-500">Manage administrator accounts</p>
          </div>
        </div>
        <Link
          href="/admin/admins/new"
          className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold py-2.5 px-4 text-sm hover:opacity-90 transition-all"
        >
          <UserPlus className="h-4 w-4" />
          Add Admin
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left font-semibold text-gray-600 px-6 py-3">Name</th>
              <th className="text-left font-semibold text-gray-600 px-6 py-3">Email</th>
              <th className="text-left font-semibold text-gray-600 px-6 py-3">Role</th>
              <th className="text-left font-semibold text-gray-600 px-6 py-3">Status</th>
              <th className="text-left font-semibold text-gray-600 px-6 py-3">Last Login</th>
              <th className="text-right font-semibold text-gray-600 px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {admins.map((admin) => (
              <tr key={admin.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{admin.fullName}</td>
                <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleBadgeColor[admin.role] || "bg-gray-100 text-gray-700"}`}>
                    {admin.role.replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${admin.isActive ? "text-green-600" : "text-red-500"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${admin.isActive ? "bg-green-500" : "bg-red-400"}`} />
                    {admin.isActive ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-500 text-xs">
                  {admin.lastLoginAt
                    ? new Date(admin.lastLoginAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Never"}
                </td>
                <td className="px-6 py-4 text-right">
                  {admin.role !== "SUPER_ADMIN" && (
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => toggleActive(admin)}
                        className="inline-flex items-center justify-center rounded-lg p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                        title={admin.isActive ? "Disable" : "Enable"}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteAdmin(admin)}
                        className="inline-flex items-center justify-center rounded-lg p-1.5 hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
