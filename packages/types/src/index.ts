// ============================================================
// @toursbu/types — Shared TypeScript types & enums
// ============================================================

// ─── Enums ───────────────────────────────────────────────────

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  ORGANIZER = "ORGANIZER",
  STUDENT = "STUDENT",
}

export enum Gender {
  MALE = "MALE",
  FEMALE = "FEMALE",
  OTHER = "OTHER",
  PREFER_NOT_TO_SAY = "PREFER_NOT_TO_SAY",
}

export enum TripStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED",
}

export enum Difficulty {
  EASY = "EASY",
  MODERATE = "MODERATE",
  HARD = "HARD",
}

export enum BookingStatus {
  PENDING_PAYMENT = "PENDING_PAYMENT",
  PAYMENT_RECEIVED = "PAYMENT_RECEIVED",
  CONFIRMED = "CONFIRMED",
  WAITLISTED = "WAITLISTED",
  CHECKED_IN = "CHECKED_IN",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
  REFUNDED = "REFUNDED",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export enum PaymentGateway {
  RAZORPAY = "RAZORPAY",
  OFFLINE = "OFFLINE",
  BANK_TRANSFER = "BANK_TRANSFER",
}

export enum PaymentMethod {
  UPI = "UPI",
  CARD = "CARD",
  NETBANKING = "NETBANKING",
  WALLET = "WALLET",
  BANK_TRANSFER = "BANK_TRANSFER",
  OFFLINE = "OFFLINE",
}

export enum FeatureType {
  INCLUDED = "INCLUDED",
  EXCLUDED = "EXCLUDED",
}

export enum ActivityType {
  TRAVEL = "TRAVEL",
  ACTIVITY = "ACTIVITY",
  MEAL = "MEAL",
  STAY = "STAY",
  FREE = "FREE",
}

export enum WaitlistStatus {
  WAITING = "WAITING",
  NOTIFIED = "NOTIFIED",
  CONVERTED = "CONVERTED",
  EXPIRED = "EXPIRED",
}

export enum NotificationType {
  BOOKING = "BOOKING",
  PAYMENT = "PAYMENT",
  TRIP = "TRIP",
  SYSTEM = "SYSTEM",
  PROMOTION = "PROMOTION",
}

export enum EmailStatus {
  QUEUED = "QUEUED",
  SENT = "SENT",
  FAILED = "FAILED",
}

export enum CouponType {
  PERCENTAGE = "PERCENTAGE",
  FLAT = "FLAT",
}

export enum MediaType {
  IMAGE = "IMAGE",
  PDF = "PDF",
  VIDEO = "VIDEO",
}

export enum ContentBlockType {
  HERO = "hero",
  TESTIMONIAL = "testimonial",
  FAQ = "faq",
  ANNOUNCEMENT = "announcement",
  HOMEPAGE_BANNER = "homepage-banner",
  HOMEPAGE_VIDEO = "homepage-video",
  FEATURE_SECTION = "feature-section",
  GALLERY = "gallery",
}

export enum ContentBlockStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export enum AnnouncementType {
  INFO = "INFO",
  WARNING = "WARNING",
  SUCCESS = "SUCCESS",
}

// ─── Entity Types ────────────────────────────────────────────

export interface Organization {
  id: string;
  name: string;
  logo: string;
  website: string;
  supportEmail: string;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatar: string;
  role: `${UserRole}`;
  college: string;
  gender: `${Gender}`;
  age: number;
  emergencyContact: string;
  emergencyPhone: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
}

export interface Trip {
  id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  price: number;
  advanceAmount: number;
  totalSeats: number;
  availableSeats: number;
  tripStatus: `${TripStatus}`;
  difficulty: `${Difficulty}`;
  duration: string;
  pickupPoint: string;
  startDate: string;
  endDate: string;
  whatsappLink: string;
  brochureUrl: string;
  coverImage: string;
  accommodation: string;
  travelDetails: string;
  terms: string[];
  cancellationPolicy: string[];
  categoryId: string;
  category?: Category;
  organizationId: string;
  createdById: string;
  images?: TripImage[];
  features?: TripFeature[];
  days?: Day[];
  faqs?: TripFaq[];
  createdAt: string;
  updatedAt: string;
}

export interface TripImage {
  id: string;
  tripId: string;
  mediaId: string;
  url: string;
  alt: string;
  order: number;
}

export interface TripFeature {
  id: string;
  tripId: string;
  type: `${FeatureType}`;
  label: string;
  icon: string;
  order: number;
}

export interface Day {
  id: string;
  tripId: string;
  dayNumber: number;
  title: string;
  description: string;
  activities?: Activity[];
}

export interface Activity {
  id: string;
  dayId: string;
  title: string;
  description: string;
  time: string;
  location: string;
  type: `${ActivityType}`;
  order: number;
}

export interface TripFaq {
  id: string;
  tripId: string;
  question: string;
  answer: string;
  order: number;
}

export interface Booking {
  id: string;
  bookingId: string;
  tripId: string;
  trip?: Trip;
  userId: string;
  user?: User;
  status: `${BookingStatus}`;
  amountPaid: number;
  remainingAmount: number;
  whatsappJoined: boolean;
  checkedIn: boolean;
  specialRequests: string;
  roomAllocation: string;
  busAllocation: string;
  notes: string;
  payments?: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  bookingId: string;
  booking?: Booking;
  gateway: `${PaymentGateway}`;
  gatewayOrderId: string;
  gatewayPaymentId: string;
  status: `${PaymentStatus}`;
  paymentMethod: `${PaymentMethod}`;
  amount: number;
  currency: string;
  receiptUrl: string;
  paidAt: string;
  createdAt: string;
}

export interface Review {
  id: string;
  tripId: string;
  userId: string;
  user?: User;
  rating: number;
  review: string;
  images: string[];
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  type: `${CouponType}`;
  maxUses: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
  createdAt: string;
}

export interface Waitlist {
  id: string;
  tripId: string;
  userId: string;
  user?: User;
  status: `${WaitlistStatus}`;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: `${NotificationType}`;
  isRead: boolean;
  createdAt: string;
}

export interface EmailQueue {
  id: string;
  recipient: string;
  subject: string;
  template: string;
  data: Record<string, unknown>;
  status: `${EmailStatus}`;
  sentAt: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  action: string;
  entity: string;
  entityId: string;
  ipAddress: string;
  timestamp: string;
}

export interface Media {
  id: string;
  url: string;
  provider: "LOCAL" | "SUPABASE" | "CLOUDINARY";
  type: `${MediaType}`;
  size: number;
  uploadedBy: string;
  createdAt: string;
}

export interface ContentBlock {
  id: string;
  type: `${ContentBlockType}`;
  slug: string;
  title: string;
  content: Record<string, unknown>;
  status: `${ContentBlockStatus}`;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Settings {
  id: string;
  key: string;
  value: string;
  description: string;
  updatedAt: string;
}

// ─── API Response Types ──────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ─── Dashboard Types ─────────────────────────────────────────

export interface DashboardStats {
  totalRevenue: number;
  revenueThisMonth: number;
  todayBookings: number;
  upcomingTrips: number;
  seatOccupancy: number;
  avgBookingValue: number;
  popularDestination: string;
  pendingPayments: number;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  bookings: number;
}

export interface TopTrip {
  id: string;
  title: string;
  bookings: number;
  revenue: number;
  occupancy: number;
}

export interface RecentActivity {
  id: string;
  type: "booking" | "payment" | "trip" | "user";
  message: string;
  timestamp: string;
  icon: string;
}

// ─── CMS Content Shapes ─────────────────────────────────────

export interface HeroContent {
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
}

export interface TestimonialContent {
  name: string;
  college: string;
  quote: string;
  avatar: string;
  rating: number;
  tripName: string;
}

export interface FaqContent {
  question: string;
  answer: string;
  category: string;
}

export interface AnnouncementContent {
  message: string;
  type: `${AnnouncementType}`;
  expiresAt: string;
  link?: string;
}
