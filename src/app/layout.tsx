import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // PREVENT DUPLICATE INJECTION

import type { Metadata } from "next";
import "./globals.css";
import { bodyFontVars } from "@/lib/fonts";
import Header from "@/components/header"; // adjust path if different
import ReactQueryProvider from "@/components/providers/react-query-provider";

export const metadata: Metadata = {
  title: "Dimar Candles",
  description: "Handcrafted candles & home fragrances",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${bodyFontVars} antialiased`}>
        <ReactQueryProvider>
          <Header />
          {children}
        </ReactQueryProvider>
      </body>
    </html>
  );
}
