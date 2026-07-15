"use client";

import { users } from "@/lib/data/users";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/shared/stat-card";
import { Users, ShieldCheck, GraduationCap, UserCog } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function AdminUsersPage() {
  const students = users.filter((u) => u.role === "STUDENT");
  const admins = users.filter((u) => u.role === "SUPER_ADMIN" || u.role === "ADMIN");
  const organizers = users.filter((u) => u.role === "ORGANIZER");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Users"
        description="Manage all registered users on the platform."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Users" },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <StatCard title="Total Users" value={users.length.toString()} icon={Users} iconColor="text-blue-500" />
        <StatCard title="Students" value={students.length.toString()} icon={GraduationCap} iconColor="text-emerald-500" />
        <StatCard title="Organizers" value={organizers.length.toString()} icon={UserCog} iconColor="text-purple-500" />
        <StatCard title="Admins" value={admins.length.toString()} icon={ShieldCheck} iconColor="text-amber-500" />
      </div>

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.5)]">
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Name</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Email</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">College</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Role</th>
                <th className="px-4 py-3 text-left font-medium text-[hsl(var(--muted-foreground))]">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[hsl(var(--border))]">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[hsl(var(--muted)/0.3)] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] text-xs font-bold">
                        {user.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <span className="font-medium text-[hsl(var(--foreground))]">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{user.email}</td>
                  <td className="px-4 py-3 text-[hsl(var(--muted-foreground))]">{user.college}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-[hsl(var(--muted))] px-2.5 py-0.5 text-xs font-medium text-[hsl(var(--foreground))]">
                      {user.role.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[hsl(var(--muted-foreground))]">{formatDate(user.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
