"use client";

import { PageHeader } from "@/components/shared/page-header";
import { Bell, Lock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [whatsappNotifs, setWhatsappNotifs] = useState(true);

  return (
    <div className="space-y-8 max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Settings"
        description="Manage your account preferences and security."
      />

      <div className="space-y-6">
        {/* Notifications */}
        <section className="rounded-[24px] border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--tbu-blue-soft)] text-[var(--tbu-blue)]">
              <Bell className="h-5 w-5" />
            </div>
            <h2 className="text-body font-bold text-[var(--tbu-ink)]">Notifications</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[var(--tbu-ink)]">Email Notifications</h3>
                <p className="text-caption text-[var(--tbu-muted)] mt-1">Receive booking confirmations and receipts via email.</p>
              </div>
              <button 
                onClick={() => setEmailNotifs(!emailNotifs)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  emailNotifs ? "bg-[var(--tbu-ink)]" : "bg-[var(--tbu-hairline-strong)]"
                )}
              >
                <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", emailNotifs ? "translate-x-5" : "translate-x-0")} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-[var(--tbu-ink)]">WhatsApp Updates</h3>
                <p className="text-caption text-[var(--tbu-muted)] mt-1">Get real-time trip updates and community announcements.</p>
              </div>
              <button 
                onClick={() => setWhatsappNotifs(!whatsappNotifs)}
                className={cn(
                  "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  whatsappNotifs ? "bg-[#25D366]" : "bg-[var(--tbu-hairline-strong)]"
                )}
              >
                <span className={cn("pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out", whatsappNotifs ? "translate-x-5" : "translate-x-0")} />
              </button>
            </div>
          </div>
        </section>

        {/* Security */}
        <section className="rounded-[24px] border border-[var(--tbu-hairline)] bg-[var(--tbu-canvas)] shadow-sm p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <Lock className="h-5 w-5" />
            </div>
            <h2 className="text-body font-bold text-[var(--tbu-ink)]">Security</h2>
          </div>
          
          <div className="space-y-4">
            <button className="flex w-full items-center justify-between rounded-xl border border-[var(--tbu-hairline)] p-4 hover:bg-[var(--tbu-surface)] transition-colors text-left">
              <div className="flex flex-col items-start">
                <span className="font-semibold text-[var(--tbu-ink)]">Change Password</span>
                <span className="text-caption text-[var(--tbu-muted)]">Update your account password</span>
              </div>
            </button>
            
            <button className="flex w-full items-center justify-between rounded-xl border border-[var(--tbu-hairline)] p-4 hover:bg-[var(--tbu-surface)] transition-colors text-left">
              <div className="flex flex-col items-start">
                <span className="font-semibold text-[var(--tbu-ink)]">Two-Factor Authentication</span>
                <span className="text-caption text-[var(--tbu-muted)]">Add an extra layer of security</span>
              </div>
              <span className="rounded bg-[var(--tbu-surface)] px-2 py-1 text-[11px] font-semibold text-[var(--tbu-ink)] border border-[var(--tbu-hairline-strong)]">Off</span>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
