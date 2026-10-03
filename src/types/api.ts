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

export interface RegisterResponse {
  message?: string;
  user: { id: string | number; email: string };
  access: string;
  refresh: string;
}

export interface SetUserTypePayload {
  user_type: "client" | "artisan";
}

export type ProviderStatus = "none" | "draft" | "pending" | "approved" | "rejected";

export interface SetUserTypeResponse {
  message: string;
  is_client: boolean;
  is_artisan: boolean;
  provider_status?: ProviderStatus;
}

export interface User {
  id: string | number;
  email: string;
  first_name?: string;
  last_name?: string;
  /** "client" (customer), "artisan" (provider), or null until the role is chosen. */
  user_type?: "client" | "artisan" | string | null;
  is_verified?: boolean;
  phone_number?: string;
  profile_picture?: string | null;
  /** An account can be a customer, a provider, or both. */
  is_client?: boolean;
  is_artisan?: boolean;
  /** False until the last onboarding step has been saved (for the account's main role). */
  onboarding_complete?: boolean;
  client_onboarding_complete?: boolean;
  provider_onboarding_complete?: boolean;
  /** Where the provider side is in review: none -> draft -> pending -> approved / rejected. */
  provider_status?: ProviderStatus;
  provider_rejection_reason?: string;
  created_at?: string | null;
}

export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  profile_picture?: File | null;
}

export interface ChangePasswordPayload {
  current_password: string;
  new_password: string;
  confirm_password: string;
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

export interface ClientProfilePayload {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  address?: string;
  location?: string; // free text or "lat,lng"
  date_of_birth?: string; // YYYY-MM-DD
  preferred_categories?: string[]; // backend category names, e.g. "Cleaning and Waste"
  profile_picture?: File | null;
}

export interface ArtisanKycPayload {
  first_name: string;
  last_name: string;
  date_of_birth: string; // YYYY-MM-DD
  gender: string;
  address: string;
  landmark?: string;
  profile_picture?: File | null;
  proof_of_address?: File | null;
  id_type?: string;
  id_front?: File | null;
  id_back?: File | null;
}

export interface ArtisanCustomizationPayload {
  services?: (string | number)[];
  business_name?: string;
  business_about?: string;
  bio?: string;
  experience?: string; // "1" .. "10"
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

/** Statuses the backend actually uses. */
export type BookingStatus = "pending" | "active" | "completed" | "cancelled";
export type PaymentStatus = "unpaid" | "held" | "released" | "refunded" | "disputed";

export interface CreateBookingPayload {
  artisian: number; // Artisan user ID (note: backend spelling is 'artisian')
  service_name: string;
  service_description: string;
  service_category: string;
  location: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM:SS
  payment_option?: string;
  /** What the customer expects to spend (optional). */
  budget?: number | null;
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
  budget?: string | null;
  /** The provider's quote, set when they accept. Decimal string. */
  price?: string | null;
  payment_status: PaymentStatus;
  /** What the provider receives after the platform's commission. */
  provider_payout?: string | null;
  commission_amount?: string;
  accepted_at?: string | null;
  paid_at?: string | null;
  completed_at?: string | null;
  released_at?: string | null;
  /** When held money is paid out automatically if the customer doesn't respond. */
  auto_release_at?: string | null;
  cancelled_by?: "client" | "artisan" | "";
  decline_reason?: string;
  dispute_reason?: string;
  client: number;
  artisian: number;
  created_at?: string;
  /** Which side the signed-in user is on for this booking. */
  role?: "client" | "artisan" | null;
  artisan_name?: string | null;
  artisan_profile_id?: number | null;
  artisan_avatar?: string | null;
  client_name?: string | null;
}

export interface ReviewBookingPayload {
  client_review: string;
  client_rating: number; // 1-5
}

// ==================== ARTISANS (PUBLIC) ====================

/** A provider as shown on cards in browse / search / recommended lists. */
export interface ArtisanSummary {
  id: number; // artisan profile id (used in /dashboard/provider/[id])
  user_id: number; // account id (what a booking's `artisian` expects)
  name: string;
  business_name: string;
  first_name: string;
  last_name: string;
  profile_picture: string | null;
  location: string;
  services: string[];
  categories: string[];
  availability: string[];
  service_years: string | null;
  rating: number;
  review_count: number;
  min_price: string;
  max_price: string;
  is_open?: boolean;
  /** Distance from the customer, when their location is known. */
  distance_km?: number | null;
}

export interface ArtisanDetail {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  business_name: string;
  bio: string;
  business_about: string;
  services: string[];
  service_years: string | null;
  language: string;
  location: string;
  availability: string[];
  min_price: string;
  max_price: string;
  profile_picture: string | null;
  certification: string | null;
  rating: number;
  review_count: number;
  is_open: boolean;
}

export interface ArtisanReview {
  id: string;
  client_name: string;
  client_avatar: string | null;
  client_rating: number;
  client_review: string | null;
  created_at: string | null;
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
  transaction_type: "deposit" | "withdrawal" | "transfer" | "payment" | "refund" | "escrow_hold" | "escrow_release";
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
  /** Where Paystack sends the user after paying; must be one of our own origins. */
  callback_url?: string;
}

export interface VerifyDepositResponse {
  transaction: WalletTransaction;
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


// ==================== PROVIDER ====================

export interface ProviderStats {
  earned: number | string;
  in_escrow: number | string;
  /** Earnings that can be withdrawn right now. */
  available: number | string;
  wallet_balance: number | string;
  new_requests: number;
  active_jobs: number;
  awaiting_confirmation: number;
  completed_jobs: number;
  rating: number | null;
  review_count: number;
  /** Percent, or null before the provider has answered any request. */
  acceptance_rate: number | null;
}

export interface Bank {
  name: string;
  code: string;
}

export interface BankAccount {
  id: number;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
}

export interface ServiceArea {
  location?: string;
  latitude?: number | string | null;
  longitude?: number | string | null;
  service_radius_km?: number;
}

/** The signed-in provider's own profile (GET /api/artisan/profile/). */
export interface MyProviderProfile {
  id: number;
  business_name: string;
  kyc_status: ProviderStatus;
  kyc_rejection_reason: string;
  is_online: boolean;
  location: string;
  latitude: string | null;
  longitude: string | null;
  service_radius_km: number;
  profile_completeness: number;
  profile_missing: string[];
  availability_data?: { id: number; name: string }[];
}
