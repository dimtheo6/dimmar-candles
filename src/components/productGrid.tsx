"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Item } from "@/constants";

interface ProductGridProps {
  items: Item[];
  isLoading: boolean;
  error?: string | null;
  filteredItems?: Item[];
}

export default function ProductGrid({
  items,
  isLoading,
  error,
  filteredItems,
}: ProductGridProps) {

  const displayItems = filteredItems || items;

  if (isLoading) {
    return (
      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="animate-pulse bg-neutral-100 aspect-square rounded-2xl" />
            <div className="space-y-2">
              <div className="animate-pulse h-4 bg-neutral-100 rounded w-3/4" />
              <div className="animate-pulse h-3 bg-neutral-100 rounded w-1/2" />
              <div className="animate-pulse h-4 bg-neutral-100 rounded w-1/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="text-sm text-neutral-900 underline hover:no-underline transition-all"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (displayItems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🕯️</div>
        <h3 className="text-xl font-light text-neutral-900 mb-2">
          No products found
        </h3>
        <p className="text-neutral-600">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }
console.log('Rendering item:', displayItems);
  return (
    <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      
      {displayItems.map((item) => {   
        const fullSlug = `${item.slug}-${item.id}`;
        return (
          <Link key={item.id} href={`/product/${fullSlug}`} className="group">
            <div className="space-y-4">
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
                {item.imageUrl &&
                Array.isArray(item.imageUrl) &&
                item.imageUrl.length > 0 ? (
                  <Image
                    src={item.imageUrl[0]}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <div className="text-center text-neutral-300">
                      <div className="text-4xl mb-2">🕯️</div>
                      <p className="text-xs">No Image</p>
                    </div>
                  </div>
                )}

                {/* Stock Status Badge */}
                {!item.inStock && (
                  <div className="absolute top-3 right-3 bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-medium">
                    Out of Stock
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <h3 className="text-lg font-light text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {item.description}
                  </p>
                )}

                {/* Product Details */}
                <div className="space-y-1">
                  {item.scent && (
                    <p className="text-xs text-neutral-400">
                      Scent: {item.scent}
                    </p>
                  )}
                  {item.burnTime && (
                    <p className="text-xs text-neutral-400">
                      Burn Time: {item.burnTime}
                    </p>
                  )}
                </div>

                {/* Price and Stock */}
                <div className="flex items-center justify-between">
                  {typeof item.price === "number" && (
                    <p className="text-lg font-light text-neutral-900">
                      ${item.price.toFixed(2)}
                    </p>
                  )}

                  <div className="flex items-center gap-2">
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        item.inStock ? "bg-green-400" : "bg-red-400"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        item.inStock ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {item.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
