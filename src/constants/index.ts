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
  type?: string; // Collection type: candles, diffusers, homewares
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
    img: "/images/homewares.webp",
  },
  {
    id: 2,
    text: "Candles",
    url: "/candles",
    img: "/images/carousel_candle2.jpg",
  },
  {
    id: 3,
    text: "Diffusers",
    url: "/diffusers",
    img: "/images/diffusers.webp",
  },
  {
    id: 4,
    text: "New Arrivals",
    url: "/candles",
    img: "/images/newArrivals.webp",
  },
];

export const carouselItems = [
  {
    id: "1",
    imageUrl: "/images/carousel_candle.jpg",
    alt: "Carousel Image 1",
    title: "Elegant Scented Candles",
    description: "Transform your space with our premium candles.",
  },
  {
    id: "2",
    imageUrl: "/images/carousel_candle2.jpg",
    alt: "Carousel Image 2",
    title: "Elegant Scented Candles",
    description: "Transform your space with our premium candles.",
  },
  {
    id: "3",
    imageUrl: "/images/carousel_candle3.jpg",
    alt: "Carousel Image 3",
    title: "Elegant Scented Candles",
    description: "Transform your space with our premium candles.",
  },
];

export const footerLinks = [
  "Privacy Policy",
  "Terms of Use",
  "Sales Policy",
  "Legal",
  "Site Map",
];
