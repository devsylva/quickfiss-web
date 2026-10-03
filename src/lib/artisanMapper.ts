import type { Provider, Review } from "@/components/ui/ProviderCard";
import type { ArtisanDetail, ArtisanReview, ArtisanSummary } from "@/types/api";

const AVAILABILITY_LABELS: Record<string, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  NIGHT: "Evening",
};

export const formatNaira = (value: string | number | null | undefined) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0 ? `₦${amount.toLocaleString("en-NG")}` : "";
};

export const describeAvailability = (slots: string[]) =>
  slots.length > 0 ? slots.map((slot) => AVAILABILITY_LABELS[slot] ?? slot).join(", ") : "Not specified";

export function timeAgo(iso: string | null | undefined): string {
  if (!iso) return "";
  const seconds = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  const units: [number, string][] = [
    [31536000, "year"],
    [2592000, "month"],
    [604800, "week"],
    [86400, "day"],
    [3600, "hour"],
    [60, "minute"],
  ];
  for (const [size, label] of units) {
    if (seconds >= size) {
      const n = Math.floor(seconds / size);
      return `${n} ${label}${n === 1 ? "" : "s"} ago`;
    }
  }
  return "Just now";
}

/** A browse/search/recommended card. */
export function summaryToProvider(item: ArtisanSummary): Provider {
  return {
    id: String(item.id),
    userId: item.user_id,
    name: item.name,
    priceFrom: formatNaira(item.min_price),
    tags: item.services.slice(0, 3),
    distance: item.location || "Location not set",
    isOpen: true,
    rating: item.rating,
    reviewCount: item.review_count,
    image: item.profile_picture ?? undefined,
    location: item.location || undefined,
  };
}

export function reviewToCardReview(review: ArtisanReview): Review {
  return {
    name: review.client_name,
    timeAgo: timeAgo(review.created_at),
    rating: review.client_rating,
    body: review.client_review ?? "",
  };
}

/** The full provider page. */
export function detailToProvider(item: ArtisanDetail, reviews: ArtisanReview[] = []): Provider {
  const person = `${item.first_name} ${item.last_name}`.trim();
  return {
    id: String(item.id),
    userId: item.user_id,
    name: item.business_name || person || "Provider",
    tagline: item.business_name && person ? person : undefined,
    priceFrom: formatNaira(item.min_price),
    tags: item.services,
    distance: item.location || "Location not set",
    isOpen: item.is_open,
    rating: item.rating,
    reviewCount: item.review_count,
    image: item.profile_picture ?? undefined,
    location: item.location || "Not specified",
    experienceText: item.service_years ?? "Not specified",
    availabilityText: describeAvailability(item.availability),
    languageText: item.language || "Not specified",
    description: item.business_about || item.bio || "This provider hasn't added a description yet.",
    reviews: reviews.map(reviewToCardReview),
  };
}
