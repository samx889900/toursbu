"use client";

import { PageHeader } from "@/components/shared/page-header";
import { settings } from "@/lib/data/settings";
import { Save } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState(
    Object.fromEntries(settings.map((s) => [s.key, s.value]))
  );

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure platform-wide settings."
        breadcrumbs={[
          { label: "Dashboard", href: "/admin" },
          { label: "Settings" },
        ]}
        actions={
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] px-4 py-2.5 text-sm font-medium transition-all hover:opacity-90"
          >
            <Save className="h-4 w-4" />
            Save Settings
          </button>
        }
      />

      <div className="rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] divide-y divide-[hsl(var(--border))]">
        {settings.map((setting) => (
          <div key={setting.id} className="flex flex-col gap-2 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              <label
                htmlFor={setting.key}
                className="text-sm font-medium text-[hsl(var(--foreground))] block"
              >
                {setting.key}
              </label>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                {setting.description}
              </p>
            </div>
            <div className="sm:w-64">
              {setting.key === "bookingOpen" || setting.key === "maintenanceMode" ? (
                <select
                  id={setting.key}
                  value={formData[setting.key]}
                  onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.value })}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                >
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              ) : (
                <input
                  id={setting.key}
                  type="text"
                  value={formData[setting.key]}
                  onChange={(e) => setFormData({ ...formData, [setting.key]: e.target.value })}
                  className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))]"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
