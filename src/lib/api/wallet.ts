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
  Bank,
  BankAccount,
  VerifyDepositResponse,
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
   * The signed-in user's own wallet
   */
  getMyWallet: () => {
    return apiClient<Wallet>("/api/billings/wallet/me/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * List every wallet (admin only)
   */
  getWallets: () => {
    return apiClient<Wallet[]>("/api/billings/wallets/", {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Get a wallet by its owner's user id
   */
  getWalletByUserId: (userId: string | number) => {
    return apiClient<Wallet>(`/api/billings/wallet/${userId}/`, {
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
  updateWallet: (userId: string | number, data: { currency?: string; is_active?: boolean }) => {
    return apiClient<Wallet>(`/api/billings/wallet/${userId}/update/`, {
      method: "PUT",
      body: data,
      requiresAuth: true,
    });
  },

  /**
   * Add funds to a wallet (manual/internal)
   */
  fundWallet: (userId: string | number, data: { amount: number; description?: string }) => {
    return apiClient<{ wallet: Wallet; transaction_id: string }>(
      `/api/billings/wallet/${userId}/fund/`,
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
   * Paginated transaction history for the logged-in user's own wallet
   */
  getMyTransactions: (params: { page?: number; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.page) qs.set("page", String(params.page));
    if (params.limit) qs.set("limit", String(params.limit));
    const query = qs.toString();
    return apiClient<WalletTransaction[]>(
      `/api/billings/transactions/${query ? `?${query}` : ""}`,
      { method: "GET", requiresAuth: true }
    );
  },

  /**
   * Transaction history for a given user id
   */
  getTransactionHistory: (userId: string | number) => {
    return apiClient<WalletTransaction[]>(`/api/billings/transactions/${userId}/`, {
      method: "GET",
      requiresAuth: true,
    });
  },

  /**
   * Activate a deactivated wallet
   */
  activateWallet: (userId: string | number) => {
    return apiClient<Wallet>(`/api/billings/wallet/${userId}/activate/`, {
      method: "POST",
      requiresAuth: true,
    });
  },

  /**
   * Soft-delete (deactivate) a wallet
   */
  deactivateWallet: (userId: string | number) => {
    return apiClient<Wallet>(`/api/billings/wallet/${userId}/delete/`, {
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
  verifyDeposit: (reference: string) => {
    return apiClient<VerifyDepositResponse>(
      `/api/billings/deposit/verify/${encodeURIComponent(reference)}/`,
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

  // ---- provider payouts ----

  /** Banks a payout can go to. */
  getBanks: () => apiClient<Bank[]>("/api/billings/banks/", { method: "GET", requiresAuth: true }),

  /** The name on an account, so the provider can check it before saving. */
  resolveAccount: (accountNumber: string, bankCode: string) =>
    apiClient<{ account_name: string }>("/api/billings/bank-accounts/resolve/", {
      method: "POST",
      body: { account_number: accountNumber, bank_code: bankCode },
      requiresAuth: true,
    }),

  getBankAccounts: () => apiClient<BankAccount[]>("/api/billings/bank-accounts/", { method: "GET", requiresAuth: true }),

  addBankAccount: (payload: { account_number: string; bank_code: string; bank_name: string }) =>
    apiClient<BankAccount>("/api/billings/bank-accounts/", { method: "POST", body: payload, requiresAuth: true }),

  removeBankAccount: (id: number) =>
    apiClient<null>(`/api/billings/bank-accounts/${id}/`, { method: "DELETE", requiresAuth: true }),

  /** Send earnings to a saved bank account. */
  withdraw: (amount: number, bankAccountId: number) =>
    apiClient<{ transaction_id: string; status: string; amount: number }>("/api/billings/withdraw/", {
      method: "POST",
      body: { amount, bank_account_id: bankAccountId },
      requiresAuth: true,
    }),
};
