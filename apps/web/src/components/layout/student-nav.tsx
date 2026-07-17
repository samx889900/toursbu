"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Compass, User, Bell, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { NotificationBell } from "./notification-bell";

const navItems = [
  { label: "Home", href: "/dashboard", icon: Home },
  { label: "Trips", href: "/dashboard/trips", icon: Compass },
  { label: "Profile", href: "/dashboard/profile", icon: User },
];

export function StudentNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Top Navigation */}
      <header className="hidden md:flex sticky top-0 z-50 w-full border-b border-[var(--tbu-hairline)] glass backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)] rounded-md">
            <span className="text-heading-md font-bold tracking-tight text-[var(--tbu-ink)]">
              Tours<span className="text-[var(--tbu-blue)]">BU</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-2 text-nav rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]",
                    isActive
                      ? "text-[var(--tbu-blue)]"
                      : "text-[var(--tbu-muted)] hover:text-[var(--tbu-ink)] hover:bg-[var(--tbu-surface)]"
                  )}
                >
                  {item.label}
                  {isActive && (
                    <motion.span
                      layoutId="desktop-nav-indicator"
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--tbu-blue-soft)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <NotificationBell />
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tbu-ring)]",
                pathname === "/dashboard/settings"
                  ? "bg-[var(--tbu-blue-soft)] text-[var(--tbu-blue-press)]"
                  : "text-[var(--tbu-muted)] hover:bg-[var(--tbu-surface)] hover:text-[var(--tbu-ink)]"
              )}
            >
              <Settings className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--tbu-hairline)] glass backdrop-blur-xl pb-safe">
        <nav className="flex h-16 items-center justify-around px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative flex flex-col items-center justify-center w-full h-full gap-1 text-[10px] font-medium transition-colors focus-visible:outline-none",
                  isActive ? "text-[var(--tbu-blue)]" : "text-[var(--tbu-muted)]"
                )}
              >
                <div className="relative flex items-center justify-center h-8 w-16">
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute inset-0 rounded-full bg-[var(--tbu-blue-soft)]"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <item.icon className="h-5 w-5 z-10" strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}
