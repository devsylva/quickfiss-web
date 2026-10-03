import { apiClient } from "./client";
import type { AppNotification, ApiCategory, ApiService, FeedItem, SearchArtisanItem } from "@/types/api";

export const coreApi = {
  /**
   * Retrieve list of service categories
   */
  getCategories: () => {
    return apiClient<ApiCategory[]>("/api/categories/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Retrieve list of available services
   */
  getServices: () => {
    return apiClient<ApiService[]>("/api/services/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Search for artisans by keyword or category
   */
  searchArtisans: (params?: { q?: string; category?: string }) => {
    const query = new URLSearchParams();
    if (params?.q) query.set("q", params.q);
    if (params?.category) query.set("category", params.category);

    const qs = query.toString();
    return apiClient<SearchArtisanItem[]>(`/api/chat/artisans/search/${qs ? `?${qs}` : ""}`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Get personalized artisan feed for the client
   */
  getFeed: () => {
    return apiClient<FeedItem[]>("/api/feed/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /** Public contact form. */
  sendContact: (payload: { name: string; email: string; message: string }) => {
    return apiClient<{ success: boolean }>("/api/contact/", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },

  /** The signed-in user's notifications. */
  getNotifications: () => {
    return apiClient<{ unread: number; items: AppNotification[] }>("/api/notifications/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /** Mark one notification read, or all of them when no id is given. */
  markNotificationsRead: (id?: number) => {
    return apiClient<{ success: boolean }>(id ? `/api/notifications/${id}/read/` : "/api/notifications/read/", {
      method: "POST",
      requiresAuth: true,
    });
  },
};
