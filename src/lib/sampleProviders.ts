import type { Provider } from "@/components/ui/ProviderCard";

export const sampleProviders: Record<string, Provider[]> = {
  "food-catering": [
    {
      name: "Sweet Treats by Ama",
      priceFrom: "₦500,000",
      tags: ["Private Chef", "Bulk Orders"],
      distance: "2km away",
      isOpen: true,
      rating: 4.5,
      reviewCount: 10,
      image: "/images/food-catering-1.png",
    },
    {
      name: "Food by Hilda",
      priceFrom: "₦250,000",
      tags: ["Cooking class", "Private chef"],
      distance: "2km away",
      isOpen: true,
      rating: 4.5,
      reviewCount: 10,
      image: "/images/food-catering-2.png",
    },
  ],
};
