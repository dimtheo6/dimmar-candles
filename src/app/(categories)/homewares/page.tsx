"use client";

import React from "react";
import { useCategoryItems } from "@/hooks/useCategoryItems";
import ProductGrid from "@/components/productGrid";

export default function HomewaresPage() {
  const {
    data: items = [],
    isLoading: itemsLoading,
    error: itemsError,
  } = useCategoryItems({
    category: "homewares",
  });

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 mb-4">
            Homewares
          </h1>
          <p className="text-lg text-neutral-600 max-w-2xl">
            Curated home accessories and decorative pieces to enhance your
            living space with style and elegance.
          </p>

          {/* Results Count */}
          {!itemsLoading && (
            <p className="mt-6 text-sm text-neutral-500">
              {items.length} {items.length === 1 ? "product" : "products"} found
            </p>
          )}
        </div>

        {/* Products Grid */}
        <ProductGrid
          items={items}
          isLoading={itemsLoading}
          error={itemsError?.message}
        />
      </div>
    </div>
  );
}
