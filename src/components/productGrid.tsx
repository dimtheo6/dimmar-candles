"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Item } from "@/constants";
import { useCartStore } from "@/store/cartStore";

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

  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const handleAddToCart = (item: Item) => {
    if (item) {
      addItem(item);
      openCart();
    }
  };

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
  console.log("Rendering item:", displayItems);
  return (
    <div className="grid gap-8 grid-cols-2 max-[300px]:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4">
      {displayItems.map((item) => {
        const fullSlug = `${item.slug}-${item.id}`;
        return (
          <div key={item.id} className="space-y-4 group">
            <Link href={`/product/${fullSlug}`} className="group block">
              {/* Product Image */}
              <div className="space-y-3">
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
                </div>
                <h3 className="text-lg font-light text-neutral-900 group-hover:text-neutral-600 transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </div>
              {/* Product Info */}
              <div className="space-y-2">
                {item.description && (
                  <p className="text-sm text-neutral-500 line-clamp-2">
                    {item.description}
                  </p>
                )}
                {typeof item.price === "number" && (
                  <p className="font-semibold mt-1 text-sm">
                    ${item.price.toFixed(2)}
                  </p>
                )}
              </div>
            </Link>

            {/* Buy Button*/}
            <div className="flex items-center justify-center">
              <div className="mt-2 text-center">
                {item.inStock ? (
                  <button
                    className="buy-button  opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleAddToCart(item)}
                  >
                    Add to Cart
                  </button>
                ) : (
                  <button
                    className="border-1 py-2 px-8 mt-2 opacity-50"
                    disabled
                  >
                    Out of stock
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
