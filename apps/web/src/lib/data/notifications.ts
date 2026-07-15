export type Notification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "INFO" | "SUCCESS" | "WARNING" | "ALERT";
  read: boolean;
  createdAt: string;
  link?: string;
};

export const notifications: Notification[] = [
  {
    id: "notif-1",
    userId: "user-student-1",
    title: "Payment Successful",
    message: "Your advance payment of ₹2,000 for Manali Winter Escape was received.",
    type: "SUCCESS",
    read: false,
    createdAt: "2026-07-14T10:00:00Z",
    link: "/dashboard/trips/bk-1?tab=payments",
  },
  {
    id: "notif-2",
    userId: "user-student-1",
    title: "Room Allocated",
    message: "You have been allocated Room 204 for your upcoming trip.",
    type: "INFO",
    read: true,
    createdAt: "2026-07-13T14:30:00Z",
    link: "/dashboard/trips/bk-1?tab=travel",
  },
  {
    id: "notif-3",
    userId: "user-student-1",
    title: "Trip Itinerary Updated",
    message: "Day 3 itinerary has been updated. Please check the new schedule.",
    type: "INFO",
    read: true,
    createdAt: "2026-07-10T09:15:00Z",
    link: "/dashboard/trips/bk-1?tab=itinerary",
  },
  {
    id: "notif-4",
    userId: "user-student-2",
    title: "Waitlist Update",
    message: "You are currently #3 on the waitlist for Goa Summer Break.",
    type: "WARNING",
    read: false,
    createdAt: "2026-07-14T08:00:00Z",
  }
];

export function getNotificationsByUserId(userId: string): Notification[] {
  return notifications.filter((n) => n.userId === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
