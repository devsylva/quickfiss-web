import { apiClient } from "./client";
import { getStoredRefreshToken } from "@/store/useAuthStore";
import type {
  RegisterPayload,
  RegisterResponse,
  SetUserTypePayload,
  SetUserTypeResponse,
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
