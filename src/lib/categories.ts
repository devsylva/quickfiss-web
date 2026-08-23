export interface Category {
  slug: string;
  label: string;
}

export const categories: Category[] = [
  { slug: "home-services", label: "Home Services" },
  { slug: "logistics", label: "Logistics" },
  { slug: "food-catering", label: "Food & Catering" },
  { slug: "tech-electronics", label: "Tech & Electronics" },
  { slug: "automotive", label: "Automotive" },
  { slug: "cleaning-waste", label: "Cleaning & Waste" },
  { slug: "personal-care", label: "Personal Care" },
];
