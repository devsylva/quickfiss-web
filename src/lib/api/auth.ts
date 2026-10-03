import { apiClient } from "./client";
import { getStoredRefreshToken } from "@/store/useAuthStore";
import type {
  RegisterPayload,
  RegisterResponse,
  SetUserTypePayload,
  SetUserTypeResponse,
  UpdateProfilePayload,
  ChangePasswordPayload,
  User,
  LoginPayload,
  AuthTokens,
  RefreshTokenPayload,
  RefreshTokenResponse,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "@/types/api";

export const authApi = {
  /**
   * Register a new client or artisan
   */
  register: (payload: RegisterPayload) => {
    return apiClient<RegisterResponse>("/api/register/", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },

  /**
   * Login — get JWT access + refresh token pair
   */
  login: (payload: LoginPayload) => {
    return apiClient<AuthTokens>("/api/token/", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },

  /**
   * Refresh the access token
   */
  refreshToken: (payload: RefreshTokenPayload) => {
    return apiClient<RefreshTokenResponse>("/api/token/refresh/", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },

  /**
   * Verify OTP sent to user's email after registration
   */
  verifyOtp: (payload: VerifyOtpPayload) => {
    return apiClient<{ message?: string }>("/api/verify-otp/", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },

  /**
   * Resend OTP to user's email
   */
  resendOtp: (payload: ResendOtpPayload) => {
    return apiClient<{ message?: string }>("/api/resend-otp/", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },

  /**
   * Mark the signed-in account as a customer or a provider (artisan)
   */
  setUserType: (payload: SetUserTypePayload) => {
    return apiClient<SetUserTypeResponse>("/api/user/set-type/", {
      method: "POST",
      body: payload,
      requiresAuth: true,
    });
  },

  /**
   * The signed-in user's account: name, type, verification and onboarding state
   */
  getMe: () => {
    return apiClient<User>("/api/user/me/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Update the signed-in user's name, phone number or profile picture
   */
  updateProfile: (payload: UpdateProfilePayload) => {
    const { profile_picture, ...fields } = payload;
    let body: FormData | Record<string, unknown> = fields;
    if (profile_picture) {
      const form = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined) form.append(key, String(value));
      });
      form.append("profile_picture", profile_picture);
      body = form;
    }
    return apiClient<User>("/api/user/profile/", {
      method: "PUT",
      body,
      requiresAuth: true,
    });
  },

  /**
   * Change the signed-in user's password
   */
  changePassword: (payload: ChangePasswordPayload) => {
    return apiClient<{ message: string }>("/api/change-password/", {
      method: "POST",
      body: payload,
      requiresAuth: true,
    });
  },

  /**
   * Request a password-reset code by email
   */
  forgotPassword: (payload: ForgotPasswordPayload) => {
    return apiClient<null>("/api/password/forgot/", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },

  /**
   * Verify the reset code and set a new password
   */
  resetPassword: (payload: ResetPasswordPayload) => {
    return apiClient<null>("/api/password/reset/", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },

  /**
   * Logout — invalidates current session
   */
  logout: () => {
    return apiClient<{ success: boolean; message: string }>("/api/logout/", {
      method: "POST",
      body: { refresh: getStoredRefreshToken() },
      requiresAuth: true,
    });
  },
};
