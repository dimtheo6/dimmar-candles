"use client";
import React from "react";
import SectionHeading from "./ui/section-heading";
import Image from "next/image";
import { useNewArrivals } from "@/hooks/useNewArrivals";
import Link from "next/link";

function NewArrivalsList() {
  const {
    data: items = [],
    isLoading,
    error: errorObj,
    refetch,
    isFetching,
  } = useNewArrivals();

  const errorMessage = errorObj instanceof Error ? errorObj.message : null;
  console.log(items);

  return (
    <section className="max-w-6xl mx-auto px-6">
      <SectionHeading>New Arrivals</SectionHeading>
      {(isLoading || isFetching) && (
        <div
          className="grid gap-6 grid-cols-2 md:grid-cols-4 mt-6"
          aria-label="Loading new arrivals"
        >
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse h-56 rounded-xl bg-neutral-200"
            />
          ))}
        </div>
      )}
      {errorMessage && !isLoading && (
        <div className="mt-4 text-sm text-red-600 flex items-center gap-4">
          {errorMessage}
          <button onClick={() => refetch()} className="underline">
            Retry
          </button>
        </div>
      )}
      {!isLoading && !errorMessage && items.length > 0 && (
        <div className="grid gap-6 grid-cols-2 md:grid-cols-4 mt-6">
          {items.map((item) => {
            // Create slug with ID at the end for product page routing
            const fullSlug = `${item.slug}-${item.id}`;
            return (
              <Link
                key={item.id}
                href={`/product/${fullSlug}`}
                prefetch
                className="relative group border border-neutral-300 rounded-xl p-3 bg-white shadow hover:shadow-md transition"
              >
                <div className="relative w-full h-50 mb-3 overflow-hidden rounded-lg bg-neutral-100">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl[0]}
                      alt={item.name}
                      fill
                      sizes="(max-width:768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-110 transition duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-xs text-neutral-500">
                      No Image
                    </div>
                  )}
                </div>
                <h3
                  className="text-sm font-bold line-clamp-1"
                  title={item.name}
                >
                  {item.name}
                </h3>
                <h4 className="text-sm text-black/70 line-clamp-2">
                  {item.description}
                </h4>
                {typeof item.price === "number" && (
                  <p className="font-semibold mt-1 text-sm">
                    ${item.price.toFixed(2)}
                  </p>
                )}
                <div className="mt-2 text-center">
                  {item.inStock ? (
                    <button className="buy-button mt-2">Add to Cart</button>
                  ) : (
                    <button
                      className="border-1 py-2 px-8 mt-2 opacity-50"
                      disabled
                    >
                      Out of stock
                    </button>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}{" "}
      {!isLoading && !errorMessage && items.length === 0 && (
        <p className="mt-6 text-sm text-neutral-500">No new arrivals yet.</p>
      )}
    </section>
  );
}

export default NewArrivalsList;
