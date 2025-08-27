// Centralized font imports so components can reuse without duplicating font loading.
import { Courgette, Geist, Geist_Mono } from "next/font/google";

export const courgette = Courgette({ weight: "400", subsets: ["latin"] });
export const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});
export const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

// Convenience export for composing body className in layout
export const bodyFontVars = `${geistSans.variable} ${geistMono.variable}`;
