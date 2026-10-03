import { apiClient } from "./client";
import type {
  MySubscriptionState,
  BillingPlan,
  Subscription,
  CreateBillingPlanPayload,
  UpdateBillingPlanPayload,
} from "@/types/api";

export const billingsApi = {
  /**
   * Get all available billing plans (public)
   */
  getPlans: () => {
    return apiClient<BillingPlan[]>("/api/billings/plans/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * [ADMIN] Create a new billing plan
   */
  createAdminPlan: (payload: CreateBillingPlanPayload) => {
    return apiClient<BillingPlan>("/api/billings/admin/plans/create/", {
      method: "POST",
      body: payload,
      requiresAuth: true,
    });
  },

  /**
   * [ADMIN] Update an existing billing plan
   */
  updateAdminPlan: (id: number, payload: UpdateBillingPlanPayload) => {
    return apiClient<BillingPlan>(`/api/billings/admin/plans/${id}/update/`, {
      method: "PUT",
      body: payload,
      requiresAuth: true,
    });
  },

  /**
   * [ADMIN] Delete a billing plan
   */
  deleteAdminPlan: (id: number) => {
    return apiClient<{ success: boolean; message: string }>(
      `/api/billings/admin/plans/${id}/delete/`,
      {
        method: "DELETE",
        requiresAuth: true,
      }
    );
  },

  /**
   * Subscribe current user to a plan
   */
  createSubscription: (plan_id: number) => {
    return apiClient<Subscription>("/api/billings/subscription/create/", {
      method: "POST",
      body: { plan_id },
      requiresAuth: true,
    });
  },

  /**
   * Upgrade or change current user's subscription
   */
  updateSubscription: (plan_id: number) => {
    return apiClient<Subscription>("/api/billings/subscription/update/", {
      method: "PUT",
      body: { plan_id },
      requiresAuth: true,
    });
  },

  /**
   * Buy a paid plan for 30 days from the wallet
   */
  purchaseSubscription: (plan_id: number, method: "wallet") => {
    return apiClient<MySubscriptionState>("/api/billings/subscription/purchase/", {
      method: "POST",
      body: { plan_id, method },
      requiresAuth: true,
    });
  },

  /**
   * Buy a paid plan by card: returns the Paystack link to open
   */
  purchaseSubscriptionByCard: (plan_id: number, callback_url: string) => {
    return apiClient<{ authorization_url: string; reference: string }>("/api/billings/subscription/purchase/", {
      method: "POST",
      body: { plan_id, method: "card", callback_url },
      requiresAuth: true,
    });
  },

  /**
   * After returning from Paystack: confirm the card payment
   */
  verifySubscriptionPayment: () => {
    return apiClient<MySubscriptionState>("/api/billings/subscription/verify/", {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * The plan the signed-in user is on right now
   */
  getSubscription: () => {
    return apiClient<MySubscriptionState>("/api/billings/subscription/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * [ADMIN] List all user subscriptions
   */
  getAdminSubscriptions: () => {
    return apiClient<Subscription[]>("/api/billings/admin/subscriptions/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * [ADMIN] Get a specific subscription by ID
   */
  getAdminSubscriptionById: (subscriptionId: number) => {
    return apiClient<Subscription>(
      `/api/billings/admin/subscriptions/${subscriptionId}/`,
      {
        method: "GET",
        requiresAuth: true,
      }
    );
  },
};
