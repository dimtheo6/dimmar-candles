"use client";

import React, { useState } from "react";
import { useCategoryItems } from "@/hooks/useCategoryItems";
import ProductGrid from "@/components/productGrid";
import useItemFilters from "@/hooks/useItemFilters";
import Sidebar from "@/components/sorting/sidebar";
import { candleScents } from "@/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFilter } from "@fortawesome/free-solid-svg-icons";

export default function CandlesPage() {
  const {
    data: items = [],
    isLoading: itemsLoading,
    error: itemsError,
  } = useCategoryItems({
    category: "candles",
  });

  const [isOpen, setIsOpen] = useState(false);

  const { filters, setFilters, filteredItems } = useItemFilters(items);

  const displayItems = filteredItems || items;

  return (
    <div className="min-h-screen bg-white">
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-20">
          {/* Sidebar */}
          {!isOpen && (
            <Sidebar
              filters={filters}
              setFilters={setFilters}
              scents={candleScents}
              isMobileOpen={isOpen}
              setIsMobileOpen={setIsOpen}
              filterCount={displayItems.length}
            />
          )}

          {isOpen && (
            <div>
              <Sidebar
                filters={filters}
                setFilters={setFilters}
                scents={candleScents}
                isMobileOpen={isOpen}
                setIsMobileOpen={setIsOpen}
                filterCount={displayItems.length}
              />
            </div>
          )}

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

              {/* Results Count and filter button*/}
              {!itemsLoading && (
                <div className="flex justify-between items-center py-3">
                  <p className="text-sm text-neutral-500">
                    {displayItems.length}{" "}
                    {displayItems.length === 1 ? "product" : "products"} found
                  </p>

                  {/* filter button */}
                  <button
                    type="button"
                    className="ml-4 rounded-md border border-gray-300 bg-white px-3 py-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 lg:hidden"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    <FontAwesomeIcon icon={faFilter} className="mr-2" />
                    Filter
                  </button>
                </div>
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
