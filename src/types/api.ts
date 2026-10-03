/**
 * Quickfiss API Specification - Type Definitions
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// ==================== AUTH ====================

export interface RegisterPayload {
  email: string;
  password: string;
  password2: string;
}

export interface User {
  id: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  user_type?: "client" | "artisan" | string;
  is_verified?: boolean;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user?: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

export interface VerifyOtpPayload {
  user_id: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  otp: string;
  password: string;
  password2: string;
}

// ==================== ONBOARDING & KYC ====================

export interface ArtisanKycPayload {
  first_name: string;
  last_name: string;
  date_of_birth: string; // YYYY-MM-DD
  gender: string;
  address: string;
  landmark?: string;
  profile_picture?: File | null;
  proof_of_address?: File | null;
}

export interface ArtisanCustomizationPayload {
  services?: (string | number)[];
  business_name?: string;
  business_about?: string;
  bio?: string;
  service_years?: string;
  language?: string;
  location?: string;
  availability?: string[];
  min_price?: number;
  max_price?: number;
  certification?: File | null;
}

// ==================== CORE / FEED ====================

export interface ApiCategory {
  id: number | string;
  name: string;
  slug?: string;
  icon?: string;
  description?: string;
}

export interface ApiService {
  id: number | string;
  name: string;
  category: number | string;
  description?: string;
  base_price?: number | string;
}

export interface FeedItem {
  id: number;
  artisan_id: number;
  image: string;
  job_title: string;
  availability_status: string;
  description: string;
  category_id: number;
  tags: string;
  likes: number;
  rating: number;
  distance: number;
  price: number;
  created_at: string;
}

export interface SearchArtisanItem {
  id: number;
  user: {
    id: number;
    email: string;
  };
  first_name: string;
  last_name: string;
  full_name: string;
  profile_picture: string;
  business_name: string;
}

// ==================== BOOKINGS ====================

export type BookingStatus = "pending" | "accepted" | "rejected" | "completed" | string;

export interface CreateBookingPayload {
  artisian: number; // Artisan user ID (note: backend spelling is 'artisian')
  service_name: string;
  service_description: string;
  service_category: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  photo?: string[];
  payment_option: string;
}

export interface Booking {
  id: string; // UUID
  service_name: string;
  service_description: string;
  service_category: string;
  location: string;
  booking_status: BookingStatus;
  date: string;
  time: string;
  photo: string[];
  payment_option: string;
  client_review: string | null;
  client_rating: number;
  is_reviewed: boolean;
  client: number;
  artisian: number;
  created_at?: string;
}

export interface ReviewBookingPayload {
  client_review: string;
  client_rating: number; // 1-5
}

// ==================== CHAT ====================

export interface ChatRoom {
  id: string; // UUID
  artisan: {
    id: number;
    name?: string;
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
    business_name?: string;
  };
  client: {
    id: number;
    name?: string;
    first_name?: string;
    last_name?: string;
  };
  last_message?: ChatMessage;
  unread_count?: number;
  updated_at?: string;
}

export interface ChatMessage {
  id: string;
  room?: string;
  sender?: {
    id: number;
    name?: string;
    email?: string;
  };
  message_type: "text" | "file";
  content?: string;
  file?: string;
  is_read?: boolean;
  created_at: string;
}

export interface SendTextMessagePayload {
  message_type: "text";
  content: string;
}

export interface MarkMessagesReadPayload {
  message_ids: string[];
}

// ==================== WALLET & BILLINGS ====================

export interface Wallet {
  id: string; // UUID
  user: number;
  user_email: string;
  balance: string | number;
  currency: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateWalletPayload {
  user_email: string;
  currency: string;
  initial_balance: number;
}

export interface TransferFundsPayload {
  amount: number;
  recipient_email: string;
  description?: string;
}

export interface WalletTransaction {
  id: string; // UUID
  wallet: string;
  user: number;
  user_email: string;
  amount: string;
  transaction_type: "deposit" | "withdrawal" | "transfer" | "payment" | "refund";
  status: string;
  description: string;
  paystack_reference: string | null;
  wallet_balance: string;
  metadata?: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TransferResult {
  debit_transaction: WalletTransaction;
  credit_transaction: WalletTransaction;
  new_balance: number;
}

export interface InitializeDepositPayload {
  amount: number;
  email: string;
}

export interface InitializeDepositResponse {
  authorization_url: string;
  access_code: string;
  reference: string;
  transaction_id: string;
}

export interface DirectDebitPayload {
  amount: number;
  email: string;
  authorization_code: string;
  description?: string;
}

// ==================== PLANS & SUBSCRIPTIONS ====================

export interface BillingPlan {
  id: number;
  name: string;
  description: string;
  price: string | number;
  duration_days: number;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export interface Subscription {
  id: number;
  user: number;
  plan: BillingPlan;
  start_date: string;
  end_date: string | null;
  active: boolean;
}

export interface CreateBillingPlanPayload {
  name: string;
  description: string;
  price: number;
  features: string[];
}

export interface UpdateBillingPlanPayload {
  price?: number;
  features?: string[];
}
