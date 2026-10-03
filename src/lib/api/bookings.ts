import { apiClient } from "./client";
import type { Booking, CreateBookingPayload, ProviderStats, ReviewBookingPayload } from "@/types/api";

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
   * Provider accepts a request and quotes a price (in naira)
   */
  acceptBooking: (bookingId: string, price: number) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/accept/`, {
      method: "POST",
      body: { price },
      requiresAuth: true,
    });
  },

  /**
   * Provider declines, or the customer cancels. Money already paid is refunded.
   */
  rejectBooking: (bookingId: string, reason?: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/reject/`, {
      method: "POST",
      body: { reason },
      requiresAuth: true,
    });
  },

  /**
   * Provider says the job is done (customer then confirms to release payment)
   */
  completeBooking: (bookingId: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/complete/`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Customer pays the quote into escrow, from the wallet or by card
   */
  payFromWallet: (bookingId: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/pay/`, {
      method: "POST",
      body: { method: "wallet" },
      requiresAuth: true,
    });
  },

  payByCard: (bookingId: string, callbackUrl: string) => {
    return apiClient<{ authorization_url: string; reference: string }>(`/api/bookings/${bookingId}/pay/`, {
      method: "POST",
      body: { method: "card", callback_url: callbackUrl },
      requiresAuth: true,
    });
  },

  /**
   * After returning from Paystack: confirm the card payment
   */
  verifyPayment: (bookingId: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/pay/verify/`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Customer confirms the job is done: the provider is paid
   */
  confirmBooking: (bookingId: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/confirm/`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Customer reports a problem; the payment stays held until support decides
   */
  disputeBooking: (bookingId: string, reason: string) => {
    return apiClient<Booking>(`/api/bookings/${bookingId}/dispute/`, {
      method: "POST",
      body: { reason },
      requiresAuth: true,
    });
  },

  /**
   * Provider dashboard numbers
   */
  providerStats: () => {
    return apiClient<ProviderStats>("/api/bookings/provider/stats/", {
      method: "GET",
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
