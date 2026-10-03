import Link from "next/link";
import Image from "next/image";
import { Gallery, Location, Star1 } from "iconsax-react";
import { VerifiedBadge } from "@/components/ui/VerifiedBadge";
import { SaveButton } from "@/components/ui/SaveButton";

export interface Review {
  name: string;
  timeAgo: string;
  rating: number;
  title?: string;
  body: string;
}

export interface Provider {
  /** Artisan profile id (the number in /dashboard/provider/[id]). */
  id: string;
  /** Account id of the provider; a booking's `artisian` field expects this. */
  userId?: number;
  name: string;
  tagline?: string;
  /** Empty when the provider hasn't set a price. */
  priceFrom: string;
  tags: string[];
  distance: string;
  isOpen: boolean;
  /** Paid-plan providers carry a Verified Provider badge. */
  verified?: boolean;
  rating: number;
  reviewCount: number;
  image?: string;
  location?: string;
  contact?: string;
  experienceText?: string;
  availabilityText?: string;
  languageText?: string;
  description?: string;
  reviews?: Review[];
}

export const ProviderCard: React.FC<{ provider: Provider }> = ({ provider }) => (
  <Link
    href={`/dashboard/provider/${provider.id}`}
    className="group block rounded-2xl border border-border/60 bg-white p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-border hover:shadow-md"
  >
    {provider.image ? (
      <div className="relative h-44 w-full overflow-hidden rounded-xl bg-zinc-100">
        <Image
          src={provider.image}
          alt={provider.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    ) : (
      <div className="flex h-44 w-full flex-col items-center justify-center gap-1.5 rounded-xl bg-zinc-100 text-zinc-400">
        <Gallery size={26} color="#a1a1aa" variant="Linear" />
        <span className="text-xs">Image</span>
      </div>
    )}

    <div className="mt-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-light text-xs font-semibold text-primary">
          {provider.name.charAt(0)}
        </div>
        <span className="text-base font-semibold text-foreground">{provider.name}</span>
        {provider.verified && <VerifiedBadge />}
      </div>
      <SaveButton providerId={provider.id} />
    </div>

    <div className="mt-2 flex flex-wrap items-center gap-2">
      {provider.priceFrom && (
        <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
          From {provider.priceFrom}
        </span>
      )}
      {provider.tags.map((tag) => (
        <span key={tag} className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-foreground">
          {tag}
        </span>
      ))}
    </div>

    <div className="mt-2 flex items-center justify-between text-sm">
      <span className="flex items-center gap-1 text-muted">
        <Location size={14} color="#71717a" variant="Bold" />
        {provider.distance}
        <span className="mx-1 text-border">|</span>
        <span className={provider.isOpen ? "text-emerald-500" : "text-red-500"}>
          {provider.isOpen ? "Open" : "Closed"}
        </span>
      </span>
      <span className="flex items-center gap-1 font-semibold text-foreground">
        <Star1 size={14} color="#f5b400" variant="Bold" />
        {provider.rating.toFixed(1)} <span className="font-normal text-muted">({provider.reviewCount})</span>
      </span>
    </div>
  </Link>
);
