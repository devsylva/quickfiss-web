import { apiClient } from "./client";
import type { ApiCategory, ApiService, FeedItem, SearchArtisanItem } from "@/types/api";

export const coreApi = {
  /**
   * Retrieve list of service categories
   */
  getCategories: () => {
    return apiClient<ApiCategory[]>("/api/categories/", {
      method: "GET",
      requiresAuth: false,
    });
  },

  /**
   * Retrieve list of available services
   */
  getServices: () => {
    return apiClient<ApiService[]>("/api/services/", {
      method: "GET",
      requiresAuth: false,
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
};
