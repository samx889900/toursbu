import { z } from "zod";

// ─── Auth Schemas ────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s-]+$/, "Please enter a valid phone number"),
  college: z.string().min(2, "College name is required"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[0-9]/, "Must contain at least one number"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const otpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

// ─── Traveler Details Schema ─────────────────────────────────

export const travelerSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Phone number is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"], {
    required_error: "Please select your gender",
  }),
  age: z.coerce
    .number()
    .min(16, "Must be at least 16 years old")
    .max(100, "Please enter a valid age"),
  college: z.string().min(2, "College name is required"),
  emergencyContact: z.string().min(2, "Emergency contact name is required"),
  emergencyPhone: z.string().min(10, "Emergency contact number is required"),
  specialRequests: z.string().optional(),
});

// ─── Profile Schema ──────────────────────────────────────────

export const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Phone number is required"),
  college: z.string().min(2, "College name is required"),
  gender: z.enum(["MALE", "FEMALE", "OTHER", "PREFER_NOT_TO_SAY"]).optional(),
  age: z.coerce.number().min(16).max(100).optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
});

// ─── Admin Trip Schema ───────────────────────────────────────

export const tripSchema = z.object({
  title: z.string().min(3, "Trip title is required"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  location: z.string().min(2, "Location is required"),
  price: z.coerce.number().positive("Price must be positive"),
  advanceAmount: z.coerce.number().positive("Advance amount must be positive"),
  totalSeats: z.coerce.number().int().positive("Seats must be a positive integer"),
  difficulty: z.enum(["EASY", "MODERATE", "HARD"]),
  duration: z.string().min(1, "Duration is required"),
  pickupPoint: z.string().optional(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  accommodation: z.string().optional(),
  travelDetails: z.string().optional(),
  categoryId: z.string().optional(),
  whatsappLink: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

// ─── Export types ────────────────────────────────────────────

export type LoginFormData = z.infer<typeof loginSchema>;
export type SignupFormData = z.infer<typeof signupSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type TravelerFormData = z.infer<typeof travelerSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
export type TripFormData = z.infer<typeof tripSchema>;
