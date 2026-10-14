import { z } from "zod";

// User Roles
export const UserRole = z.enum(["customer", "admin"]);
export type UserRole = z.infer<typeof UserRole>;

// User Schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string(),
  role: UserRole.default("customer"),
});
export type User = z.infer<typeof userSchema>;

// Car Schema
export const carSchema = z.object({
  id: z.string(),
  userId: z.string(),
  brand: z.string(),
  model: z.string(),
  color: z.string(),
  plateNumber: z.string(),
  year: z.number().optional(),
});
export type Car = z.infer<typeof carSchema>;

// Service Schema
export const serviceSchema = z.object({
  id: z.string(),
  name: z.string(),
  nameEn: z.string().optional(),
  description: z.string().optional(),
  price: z.string().or(z.number()),
  category: z.string(),
  isActive: z.boolean().default(true),
});
export type Service = z.infer<typeof serviceSchema>;

// Rating Schema
export const ratingSchema = z.object({
  id: z.string(),
  bookingId: z.string(),
  stars: z.number().min(1).max(5),
  comment: z.string().optional(),
});
export type Rating = z.infer<typeof ratingSchema>;

// Booking Schema
export const bookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  carId: z.string(),
  status: z.string(), // "new", "confirmed", "on_the_way", "in_progress", "completed", "cancelled"
  scheduledDate: z.string(),
  scheduledTime: z.string(),
  address: z.string(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  totalPrice: z.string().or(z.number()),
  notes: z.string().optional(),
  adminNotes: z.string().optional(),
});
export type Booking = z.infer<typeof bookingSchema>;

// BookingService junction
export type BookingService = {
  id: string;
  bookingId: string;
  serviceId: string;
  price: string | number;
  service?: Service;
};

// BookingWithDetails (including relationships)
export type BookingWithDetails = Booking & {
  car?: Car;
  user?: User;
  services?: BookingService[];
  rating?: Rating;
};

// Auth Schemas
export const loginSchema = z.object({
  phone: z.string().min(10),
  password: z.string().min(6),
});

export const registerSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  password: z.string().min(6),
});
