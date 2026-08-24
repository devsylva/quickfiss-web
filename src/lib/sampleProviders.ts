import type { Provider } from "@/components/ui/ProviderCard";

export const sampleProviders: Record<string, Provider[]> = {
  "food-catering": [
    {
      id: "sweet-treats-by-ama",
      name: "Sweet Treats by Ama",
      tagline: "Homestyle catering, made fresh",
      priceFrom: "₦500,000",
      tags: ["Private Chef", "Bulk Orders"],
      distance: "2km away",
      isOpen: true,
      rating: 4.5,
      reviewCount: 10,
      image: "/images/food-catering-1.png",
      location: "Lagos, Nigeria",
      contact: "(+234) 7031134567",
      availabilityText: "Morning, Evening",
      languageText: "English, Yoruba",
      description:
        "Experienced private chef and caterer specialising in Nigerian and continental dishes for events of any size. From intimate dinners to large bulk orders, every meal is prepared fresh with quality ingredients and careful attention to presentation.",
      reviews: [
        {
          name: "Chidinma A",
          timeAgo: "4 days ago",
          rating: 5,
          title: "Absolutely delicious!",
          body: "Ama catered our engagement party and the food was a huge hit. Everything was fresh, well seasoned, and beautifully presented. Will definitely book again.",
        },
        {
          name: "Tunde O",
          timeAgo: "1 week ago",
          rating: 4,
          body: "Great communication throughout and the bulk order arrived right on time. A couple of dishes could've used a bit more spice, but overall a solid experience.",
        },
        {
          name: "Ngozi E",
          timeAgo: "3 weeks ago",
          rating: 5,
          title: "Highly recommend",
          body: "Booked for a small office lunch and everyone kept asking who catered it. Professional, punctual, and the food by Ama did not disappoint.",
        },
      ],
    },
    {
      id: "food-by-hilda",
      name: "Food by Hilda",
      tagline: "Event catering & cooking classes",
      priceFrom: "₦250,000",
      tags: ["Cooking class", "Private chef"],
      distance: "2km away",
      isOpen: true,
      rating: 4.5,
      reviewCount: 10,
      image: "/images/food-catering-2.png",
      location: "Lagos, Nigeria",
      contact: "(+234) 8021456789",
      availabilityText: "Noon, Evening",
      languageText: "English, Pidgin",
      description:
        "Hilda offers full-service event catering along with hands-on cooking classes for beginners and enthusiasts alike. Known for generous portions, warm hospitality, and a menu that adapts to any occasion or dietary need.",
      reviews: [
        {
          name: "Bola S",
          timeAgo: "2 days ago",
          rating: 5,
          title: "Loved the cooking class",
          body: "Took one of Hilda's cooking classes with friends and it was such a fun, well-organised experience. We left with new skills and full stomachs.",
        },
        {
          name: "Emeka N",
          timeAgo: "5 days ago",
          rating: 4,
          body: "Catered our family reunion, food was great and arrived hot. Only note is booking took a couple of days to confirm.",
        },
      ],
    },
  ],
};

export const getProviderById = (id: string): Provider | undefined => {
  for (const providers of Object.values(sampleProviders)) {
    const match = providers.find((p) => p.id === id);
    if (match) return match;
  }
  return undefined;
};
