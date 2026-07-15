"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  MapPin,
  CalendarCheck,
  IndianRupee,
  Users,
  FileText,
  ScrollText,
  Settings,
  ChevronDown,
  LogOut,
  PanelLeftClose,
  PanelLeft,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";

interface SidebarItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: { label: string; href: string }[];
  roles?: string[];
}

const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  {
    label: "Trips",
    href: "/admin/trips",
    icon: MapPin,
    children: [
      { label: "All Trips", href: "/admin/trips" },
      { label: "Create Trip", href: "/admin/trips/new" },
    ],
  },
  { label: "Bookings", href: "/admin/bookings", icon: CalendarCheck },
  { label: "Payments", href: "/admin/payments", icon: IndianRupee },
  { label: "Users", href: "/admin/users", icon: Users, roles: ["SUPER_ADMIN", "ADMIN"] },
  {
    label: "CMS",
    href: "/admin/cms",
    icon: FileText,
    roles: ["SUPER_ADMIN", "ADMIN"],
    children: [
      { label: "Overview", href: "/admin/cms" },
      { label: "Hero Slides", href: "/admin/cms/hero" },
      { label: "Testimonials", href: "/admin/cms/testimonials" },
      { label: "FAQs", href: "/admin/cms/faq" },
      { label: "Announcements", href: "/admin/cms/announcements" },
    ],
  },
  { label: "Activity Log", href: "/admin/activity", icon: ScrollText, roles: ["SUPER_ADMIN", "ADMIN"] },
  { label: "Settings", href: "/admin/settings", icon: Settings, roles: ["SUPER_ADMIN"] },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (href: string) => pathname === href;
  const isGroupActive = (item: SidebarItem) =>
    pathname === item.href || item.children?.some((c) => pathname === c.href);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-[hsl(var(--sidebar-border))] bg-[hsl(var(--sidebar-background))] transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-[hsl(var(--sidebar-border))] px-4">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold">
              Tours<span className="text-[hsl(var(--primary))]">BU</span>
            </span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[hsl(var(--sidebar-foreground)/0.5)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))] transition-colors"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
        {sidebarItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0;
          const isOpen = expandedItems.includes(item.label);
          const active = isGroupActive(item);

          return (
            <div key={item.label}>
              {hasChildren ? (
                <button
                  onClick={() => toggleExpanded(item.label)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-[hsl(var(--sidebar-accent))] text-[hsl(var(--sidebar-primary))]"
                      : "text-[hsl(var(--sidebar-foreground)/0.7)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]"
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform",
                          isOpen && "rotate-180"
                        )}
                      />
                    </>
                  )}
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive(item.href)
                      ? "bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))]"
                      : "text-[hsl(var(--sidebar-foreground)/0.7)] hover:bg-[hsl(var(--sidebar-accent))] hover:text-[hsl(var(--sidebar-foreground))]"
                  )}
                >
                  <item.icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              )}

              {/* Children */}
              {hasChildren && isOpen && !collapsed && (
                <div className="ml-4 mt-1 space-y-0.5 border-l border-[hsl(var(--sidebar-border))] pl-3">
                  {item.children!.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className={cn(
                        "flex items-center rounded-lg px-3 py-2 text-xs font-medium transition-colors",
                        isActive(child.href)
                          ? "text-[hsl(var(--sidebar-primary))] bg-[hsl(var(--sidebar-primary)/0.08)]"
                          : "text-[hsl(var(--sidebar-foreground)/0.5)] hover:text-[hsl(var(--sidebar-foreground))]"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="border-t border-[hsl(var(--sidebar-border))] p-3">
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[hsl(var(--sidebar-primary))] text-[hsl(var(--sidebar-primary-foreground))] text-xs font-bold">
              SA
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[hsl(var(--sidebar-foreground))] truncate">
                Super Admin
              </p>
              <p className="text-xs text-[hsl(var(--sidebar-foreground)/0.5)] truncate">
                admin@toursbu.com
              </p>
            </div>
            <button
              className="text-[hsl(var(--sidebar-foreground)/0.4)] hover:text-[hsl(var(--sidebar-foreground))] transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </aside>
  );
}
