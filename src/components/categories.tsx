import React from "react";
import { categories } from "@/constants";
import Link from "next/link";
import Image from "next/image";

export default function Categories() {
  return (
    <>
      <section className="mx-auto px-6 py-24">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-light tracking-tight text-neutral-900">
            Categories
          </h2>
          <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
            Discover our carefully curated collection of premium candles and
            home essentials
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-10 max-w-[90rem] mx-auto">
          {categories.map((category) => (
            <Link key={category.id} href={category.url}>
              <div className="relative w-full aspect-[7/8] overflow-hidden rounded-xl">
                {/* Image */}
                <Image
                  src={category.img}
                  alt={category.text}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover rounded-xl"
                />

                {/* Overlay text at the bottom */}
                <span
                  className="absolute bottom-0 left-0 right-0 z-10 
                           flex items-center justify-center 
                           bg-black/50 text-2xl font-bold text-white p-2 rounded-b-xl "
                >
                  {category.text}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
