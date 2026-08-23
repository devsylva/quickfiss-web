import Image from "next/image";
import { Gallery, Heart, Location, Star1 } from "iconsax-react";

export interface Provider {
  name: string;
  priceFrom: string;
  tags: string[];
  distance: string;
  isOpen: boolean;
  rating: number;
  reviewCount: number;
  image?: string;
}

export const ProviderCard: React.FC<{ provider: Provider }> = ({ provider }) => (
  <div>
    {provider.image ? (
      <div className="relative h-40 w-full overflow-hidden rounded-input bg-zinc-100">
        <Image src={provider.image} alt={provider.name} fill className="object-cover" />
      </div>
    ) : (
      <div className="flex h-40 w-full flex-col items-center justify-center gap-1.5 rounded-input bg-zinc-100 text-zinc-400">
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
      </div>
      <Heart size={20} color="#a1a1aa" variant="Linear" />
    </div>

    <div className="mt-2 flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-primary-light px-3 py-1 text-xs font-medium text-primary">
        From {provider.priceFrom}
      </span>
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
  </div>
);
