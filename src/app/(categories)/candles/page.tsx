"use client";

import React from "react";
import { useCategoryItems } from "@/hooks/useCategoryItems";
import ProductGrid from "@/components/productGrid";
import useItemFilters from "@/hooks/useItemFilters";
import Sidebar from "@/components/sorting/sidebar";
import { candleScents } from "@/constants";

export default function CandlesPage() {
  const {
    data: items = [],
    isLoading: itemsLoading,
    error: itemsError,
  } = useCategoryItems({
    category: "candles",
  });

  const { filters, setFilters, filteredItems } = useItemFilters(items);

  const displayItems = filteredItems || items;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar */}
          <Sidebar filters={filters} setFilters={setFilters} scents={candleScents}/>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Page Header */}
            <div className="mb-12">
              <h1 className="text-4xl lg:text-5xl font-light tracking-tight text-neutral-900 mb-4">
                Candles
              </h1>
              <p className="text-lg text-neutral-600 max-w-2xl">
                Discover our handcrafted candle collection, each piece carefully
                made with premium materials and unique scents.
              </p>

              {/* Results Count */}
              {!itemsLoading && (
                <p className="mt-6 text-sm text-neutral-500">
                  {displayItems.length}{" "}
                  {displayItems.length === 1 ? "product" : "products"} found
                </p>
              )}
            </div>

            {/* Products Grid */}
            <ProductGrid
              items={displayItems}
              isLoading={itemsLoading}
              error={itemsError?.message}
            />
          </main>
        </div>
      </div>
    </div>
  );
}
