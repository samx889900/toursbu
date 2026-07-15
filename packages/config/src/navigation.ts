// ============================================================
// @toursbu/config — Navigation configuration
// ============================================================

import type { UserRole } from "@toursbu/types";

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  badge?: string;
  roles?: UserRole[];
  children?: NavItem[];
}

export const mainNavItems: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Explore Trips", href: "/trips" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export const dashboardNavItems: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Bookings", href: "/dashboard/bookings", icon: "Ticket" },
  { label: "Payments", href: "/dashboard/payments", icon: "CreditCard" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
];

export const adminNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "LayoutDashboard",
  },
  {
    label: "Trips",
    href: "/admin/trips",
    icon: "MapPin",
    children: [
      { label: "All Trips", href: "/admin/trips" },
      { label: "Create Trip", href: "/admin/trips/new" },
    ],
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: "CalendarCheck",
  },
  {
    label: "Payments",
    href: "/admin/payments",
    icon: "IndianRupee",
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: "Users",
    roles: ["SUPER_ADMIN", "ADMIN"] as UserRole[],
  },
  {
    label: "CMS",
    href: "/admin/cms",
    icon: "FileText",
    roles: ["SUPER_ADMIN", "ADMIN"] as UserRole[],
    children: [
      { label: "Overview", href: "/admin/cms" },
      { label: "Hero Slides", href: "/admin/cms/hero" },
      { label: "Testimonials", href: "/admin/cms/testimonials" },
      { label: "FAQs", href: "/admin/cms/faq" },
      { label: "Announcements", href: "/admin/cms/announcements" },
    ],
  },
  {
    label: "Activity Log",
    href: "/admin/activity",
    icon: "ScrollText",
    roles: ["SUPER_ADMIN", "ADMIN"] as UserRole[],
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "Settings",
    roles: ["SUPER_ADMIN"] as UserRole[],
  },
];
