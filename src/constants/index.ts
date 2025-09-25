// src/constants/index.ts
export type Category = {
  id: number;
  text: string;
  url: string;
  img: string;
};

export interface Item {
  id: string;
  name: string;
  price: number;
  inStock?: boolean;
  imageUrl?: string;
  description?: string;
  slug: string;
  createdAt: Date; // Firestore Timestamp converted to JS Date
  category?: string;
  weight?: string;
  burnTime?: string;
  scent?: string;
  material?: string;
  dimensions?: string;
  careInstructions?: string;
  ingredients?: string;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase() // lowercase
    .trim() // remove extra spaces
    .replace(/[\s]+/g, "-") // spaces → hyphens
    .replace(/[^\w-]+/g, ""); // remove special chars
}

export const scents: string[] = [
  "floral",
  "citrus",
  "woody",
  "spicy",
  "fresh",
  "fruity",
];

export const categories: Category[] = [
  {
    id: 1,
    text: "Homewares",
    url: "/homewares",
    img: "/images/candle.jpg",
  },
  {
    id: 2,
    text: "Candles",
    url: "/candles",
    img: "/images/candle.jpg",
  },
  {
    id: 3,
    text: "Diffusers",
    url: "/diffusers",
    img: "/images/candle.jpg",
  },
  {
    id: 4,
    text: "New Arrivals",
    url: "/diffusers",
    img: "/images/candle.jpg",
  },
];

export const footerLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
];
