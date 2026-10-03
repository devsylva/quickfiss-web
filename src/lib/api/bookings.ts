import { apiClient } from "./client";
import type { Booking, CreateBookingPayload, ReviewBookingPayload } from "@/types/api";

export const bookingsApi = {
  /**
   * Create a new booking
   */
  createBooking: (payload: CreateBookingPayload) => {
    return apiClient<Booking>("/api/bookings/", {
      method: "POST",
      body: payload,
      requiresAuth: true,
    });
  },

  /**
   * Attach photos to one of your bookings (JPG/PNG, up to 8 in total)
   */
  uploadPhotos: (bookingId: string, files: File[]) => {
    const form = new FormData();
    files.forEach((file) => form.append("photos", file));
    return apiClient<Booking>(`/api/bookings/${bookingId}/photos/`, {
      method: "POST",
      body: form,
      requiresAuth: true,
    });
  },

  /**
   * List all bookings (staff only)
   */
  getAllBookings: () => {
    return apiClient<Booking[]>("/api/bookings/all/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Get all bookings for the currently authenticated user
   */
  getMyBookings: () => {
    return apiClient<Booking[]>("/api/bookings/authenticated-user/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Get a single booking by UUID
   */
  getBookingById: (bookingId: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Artisan accepts a booking
   */
  acceptBooking: (bookingId: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/accept/`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Artisan rejects a booking
   */
  rejectBooking: (bookingId: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/reject/`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Mark a booking as complete
   */
  completeBooking: (bookingId: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/complete/`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Client reviews a completed booking
   */
  reviewBooking: (bookingId: string, payload: ReviewBookingPayload) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/review/`, {
      method: "POST",
      body: payload,
      requiresAuth: true,
    });
  },

  /**
   * Delete a booking
   */
  deleteBooking: (bookingId: string) => {
    return apiClient<{ success: boolean; message: string }>(`/api/bookings/${bookingId}/delete/`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },
};
