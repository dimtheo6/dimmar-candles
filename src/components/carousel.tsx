"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export type CarouselItem = {
  id: string | number;
  title: string;
  image: string;
  href?: string;
  subtitle?: string;
  price?: number;
};

interface CarouselProps {
  items: CarouselItem[];
  autoPlayMs?: number; // 0 disables autoplay
  className?: string;
  aspectClassName?: string; // tailwind aspect or height classes
}

// A lightweight, dependency‑free carousel. Shows 1 item at a time, loops, supports:
//  - buttons / keyboard arrows / swipe
//  - autoplay with pause on hover or focus
//  - accessible announcements
export default function Carousel({
  items,
  autoPlayMs = 5000,
  className = "w-full ",
  aspectClassName = "h-[50vh] sm:h-[60vh] md:h-[70vh] lg:h-[80vh] xl:h-[calc(100vh-theme(spacing.20)-theme(spacing.8))]",
}: CarouselProps) {
  const [index, setIndex] = useState(0);
  const count = items.length;
  const trackRef = useRef<HTMLDivElement>(null);
  const autoRef = useRef<NodeJS.Timeout | null>(null);
  const hoveringRef = useRef(false);
  const touching = useRef<{ startX: number; delta: number } | null>(null);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + count) % count),
    [count]
  );

  const goTo = useCallback(
    (i: number) => setIndex(((i % count) + count) % count),
    [count]
  );

  // Autoplay
  useEffect(() => {
    if (!autoPlayMs || autoPlayMs < 800 || count < 2) return;
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      if (!hoveringRef.current) go(1);
    }, autoPlayMs);
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [autoPlayMs, go, count]);

  // Keyboard nav when focused inside
  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      go(1);
    } else if (e.key === "ArrowLeft") {
      go(-1);
    }
  };

  // Touch / swipe
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touching.current = { startX: t.clientX, delta: 0 };
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touching.current) return;
    touching.current.delta = e.touches[0].clientX - touching.current.startX;
  };
  const onTouchEnd = () => {
    if (!touching.current) return;
    const { delta } = touching.current;
    if (Math.abs(delta) > 60) {
      go(delta < 0 ? 1 : -1);
    }
    touching.current = null;
  };

  return (
    <div
      className={`relative select-none ${className}`}
      onMouseEnter={() => (hoveringRef.current = true)}
      onMouseLeave={() => (hoveringRef.current = false)}
      onKeyDown={onKey}
      aria-roledescription="carousel"
    >
      <div
        className={`overflow-hidden  bg-neutral-100 ${aspectClassName}`}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        ref={trackRef}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {items.map((item) => (
            <div key={item.id} className="relative shrink-0 w-full h-full">
              {item.href ? (
                <Link href={item.href} className="absolute inset-0">
                  <SlideContent item={item} />
                </Link>
              ) : (
                <SlideContent item={item} />
              )}
            </div>
          ))}
        </div>
      </div>
      {/* Prev / Next */}
      {count > 1 && (
        <>
          <button
            aria-label="Previous slide"
            className="absolute left-0 top-1/2 -translate-y-1/2 h-full text-white  p-2 hover:bg-black/50 transition text-5xl cursor-pointer"
            onClick={() => go(-1)}
          >
            ‹
          </button>
          <button
            aria-label="Next slide"
            className="absolute right-0 top-1/2 -translate-y-1/2 h-full text-white  p-2 hover:bg-black/50 transition text-5xl cursor-pointer"
            onClick={() => go(1)}
          >
            ›
          </button>
        </>
      )}
      {/* Dots
      {count > 1 && (
        <div
          className="flex justify-center gap-2 mt-4"
          aria-label="Slide indicators"
        >
          {items.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to slide ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-2 w-2 rounded-full transition ${
                i === index
                  ? "bg-pink-600 scale-110"
                  : "bg-neutral-400 hover:bg-neutral-500"
              }`}
            />
          ))}
        </div>
      )} */}
      <p className="sr-only" aria-live="polite">
        Slide {index + 1} of {count}
      </p>
    </div>
  );
}

function SlideContent({ item }: { item: CarouselItem }) {
  return (
    <>
      <Image
        src={item.image}
        alt={item.title}
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white flex flex-col gap-2">
        <h2 className="text-2xl font-semibold drop-shadow-md">{item.title}</h2>
        {item.subtitle && (
          <p className="text-sm opacity-90 line-clamp-2">{item.subtitle}</p>
        )}
        {item.price != null && (
          <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
            ${item.price}
          </span>
        )}
      </div>
    </>
  );
}
