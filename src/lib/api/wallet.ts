import { apiClient } from "./client";
import type {
  Wallet,
  CreateWalletPayload,
  TransferFundsPayload,
  TransferResult,
  WalletTransaction,
  InitializeDepositPayload,
  InitializeDepositResponse,
  DirectDebitPayload,
} from "@/types/api";

export const walletApi = {
  /**
   * Create a wallet for a user
   */
  createWallet: (payload: CreateWalletPayload) => {
    return apiClient<Wallet>("/api/billings/wallet/create/", {
      method: "POST",
      body: payload,
      requiresAuth: true,
    });
  },

  /**
   * List all wallets for the authenticated user
   */
  getWallets: () => {
    return apiClient<Wallet[]>("/api/billings/wallets/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Get a specific wallet by ID
   */
  getWalletById: (walletId: string | number) => {
    return apiClient<Wallet>(`/api/billings/wallet/${walletId}/`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Get wallet balance for a user
   */
  getWalletBalance: (userId: number | string) => {
    return apiClient<{
      user_id: number;
      user_email: string;
      balance: number;
      currency: string;
      is_active: boolean;
    }>(`/api/billings/wallet/${userId}/balance/`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Update wallet currency or active status
   */
  updateWallet: (walletId: string | number, data: { currency?: string; is_active?: boolean }) => {
    return apiClient<Wallet>(`/api/billings/wallet/${walletId}/update/`, {
      method: "PUT",
      body: data,
      requiresAuth: true,
    });
  },

  /**
   * Add funds to a wallet (manual/internal)
   */
  fundWallet: (walletId: string | number, data: { amount: number; description?: string }) => {
    return apiClient<{ wallet: Wallet; transaction_id: string }>(
      `/api/billings/wallet/${walletId}/fund/`,
      {
        method: "POST",
        body: data,
        requiresAuth: true,
      }
    );
  },

  /**
   * Transfer funds between wallets (by recipient email)
   */
  transferFunds: (payload: TransferFundsPayload) => {
    return apiClient<TransferResult>("/api/billings/transfer/", {
      method: "POST",
      body: payload,
      requiresAuth: true,
    });
  },

  /**
   * Get wallet transaction history
   */
  getTransactionHistory: (transactionId: string | number) => {
    return apiClient<WalletTransaction[]>(`/api/billings/transactions/${transactionId}/`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Activate a deactivated wallet
   */
  activateWallet: (walletId: string | number) => {
    return apiClient<Wallet>(`/api/billings/wallet/${walletId}/activate/`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Soft-delete (deactivate) a wallet
   */
  deactivateWallet: (walletId: string | number) => {
    return apiClient<Wallet>(`/api/billings/wallet/${walletId}/delete/`, {
      method: "DELETE",
      requiresAuth: true,
    });
  },

  /**
   * Initialize Paystack deposit
   */
  initializeDeposit: (payload: InitializeDepositPayload) => {
    return apiClient<InitializeDepositResponse>("/api/billings/deposit/initialize/", {
      method: "POST",
      body: payload,
      requiresAuth: true,
    });
  },

  /**
   * Verify a Paystack deposit after returning from payment page
   */
  verifyDeposit: (transactionId: string) => {
    return apiClient<{ success: boolean; message: string; transaction: WalletTransaction }>(
      `/api/billings/deposit/verify/${transactionId}/`,
      {
        method: "GET",
        requiresAuth: true,
      }
    );
  },

  /**
   * Charge a user directly via saved Paystack authorization
   */
  directDebit: (payload: DirectDebitPayload) => {
    return apiClient("/api/billings/direct-debit/", {
      method: "POST",
      body: payload,
      requiresAuth: true,
    });
  },
};
