/**
 * Role-Based Access Control (RBAC) definitions for ToursBU
 */

export type UserRole = "SUPER_ADMIN" | "ADMIN" | "ORGANIZER" | "STUDENT";

const roleHierarchy: Record<UserRole, number> = {
  STUDENT: 1,
  ORGANIZER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
};

/**
 * Checks if a user role has access to a specific route pattern.
 */
export const canAccess = (role: UserRole | string | undefined | null, pathname: string): boolean => {
  const normalizedRole = (role as UserRole) || "STUDENT";

  // Admin boundaries
  if (pathname.startsWith("/admin")) {
    return roleHierarchy[normalizedRole] >= roleHierarchy.ADMIN;
  }

  // Organizer boundaries (e.g. creating trips)
  if (pathname.startsWith("/organizer") || pathname.startsWith("/dashboard/manage-trips")) {
    return roleHierarchy[normalizedRole] >= roleHierarchy.ORGANIZER;
  }

  // General protected routes (Dashboard, bookings, profile)
  // By default, authenticated students can access these.
  return true;
};
