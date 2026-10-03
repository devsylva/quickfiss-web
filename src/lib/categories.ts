export interface Category {
  slug: string;
  label: string;
  /** The category name as the backend stores and filters it. */
  apiName: string;
}

export const categories: Category[] = [
  { slug: "home-services", label: "Home Services", apiName: "Home Services" },
  { slug: "logistics", label: "Logistics", apiName: "Logistics" },
  { slug: "food-catering", label: "Food & Catering", apiName: "Food and Catering" },
  { slug: "tech-electronics", label: "Tech & Electronics", apiName: "Tech and Electronics" },
  { slug: "automotive", label: "Automotive", apiName: "Automotive" },
  { slug: "cleaning-waste", label: "Cleaning & Waste", apiName: "Cleaning and Waste" },
  { slug: "personal-care", label: "Personal Care", apiName: "Personal Care" },
];

/** Find a category from a backend value like "cleaning and waste" (the backend lower-cases them). */
export const findCategoryByApiName = (value: string | null | undefined) =>
  categories.find((c) => c.apiName.toLowerCase() === (value ?? "").toLowerCase());
