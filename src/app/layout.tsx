import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; // PREVENT DUPLICATE INJECTION

import type { Metadata } from "next";
import "./globals.css";
import { bodyFontVars } from "@/lib/fonts";
import ReactQueryProvider from "@/components/providers/react-query-provider";
import Shell from "@/components/providers/shell";
import ScrollToTop from "@/utils/scrollToTop";

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
      <ScrollToTop />
      <body className={`${bodyFontVars} antialiased`}>
        <ReactQueryProvider>
          <Shell>{children}</Shell>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
