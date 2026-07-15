import type { DashboardStats, RevenueDataPoint, TopTrip, RecentActivity } from "@toursbu/types";

export const dashboardStats: DashboardStats = {
  totalRevenue: 485000,
  revenueThisMonth: 72000,
  todayBookings: 5,
  upcomingTrips: 4,
  seatOccupancy: 68,
  avgBookingValue: 8450,
  popularDestination: "Manali",
  pendingPayments: 12,
};

export const revenueData: RevenueDataPoint[] = [
  { month: "Jan", revenue: 32000, bookings: 8 },
  { month: "Feb", revenue: 45000, bookings: 12 },
  { month: "Mar", revenue: 38000, bookings: 10 },
  { month: "Apr", revenue: 62000, bookings: 18 },
  { month: "May", revenue: 78000, bookings: 22 },
  { month: "Jun", revenue: 95000, bookings: 28 },
  { month: "Jul", revenue: 72000, bookings: 20 },
];

export const topTrips: TopTrip[] = [
  { id: "trip-1", title: "Manali Adventure Expedition", bookings: 28, revenue: 168000, occupancy: 70 },
  { id: "trip-2", title: "Goa Beach Carnival", bookings: 22, revenue: 132000, occupancy: 44 },
  { id: "trip-5", title: "Kashmir Paradise Escape", bookings: 17, revenue: 119000, occupancy: 68 },
  { id: "trip-4", title: "Udaipur Heritage Trail", bookings: 12, revenue: 78000, occupancy: 40 },
  { id: "trip-3", title: "Rishikesh Thrill Weekend", bookings: 35, revenue: 105000, occupancy: 100 },
];

export const recentActivities: RecentActivity[] = [
  { id: "ra-1", type: "booking", message: "Rahul Mehta booked Manali Adventure Expedition", timestamp: "2026-07-05T14:30:00Z", icon: "CalendarCheck" },
  { id: "ra-2", type: "payment", message: "Payment of ₹2,000 received for BU-A3F8K2", timestamp: "2026-07-05T14:32:00Z", icon: "IndianRupee" },
  { id: "ra-3", type: "trip", message: "Meghalaya Cloud Walk saved as draft", timestamp: "2026-07-05T10:00:00Z", icon: "MapPin" },
  { id: "ra-4", type: "user", message: "Ananya Patel signed up", timestamp: "2026-07-04T16:45:00Z", icon: "UserPlus" },
  { id: "ra-5", type: "booking", message: "Arjun Reddy cancelled Kashmir booking", timestamp: "2026-07-04T12:00:00Z", icon: "XCircle" },
  { id: "ra-6", type: "payment", message: "Refund of ₹3,000 processed for BU-H9C2M7", timestamp: "2026-07-03T15:00:00Z", icon: "RotateCcw" },
  { id: "ra-7", type: "trip", message: "Goa Beach Carnival published", timestamp: "2026-07-02T09:00:00Z", icon: "Globe" },
  { id: "ra-8", type: "booking", message: "Ananya Patel waitlisted for Rishikesh", timestamp: "2026-07-02T16:00:00Z", icon: "Clock" },
];
