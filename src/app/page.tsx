"use client";

import Afterpay from "@/components/afterpay";
import Categories from "@/components/categories";
import Carousel from "@/components/carousel";
import { categories } from "@/constants";
import NewArrivals from "@/components/newArrivalsList";
import { carouselItems } from "@/constants";


export default function Home() {
  return (
    <>
      <Carousel
        items={carouselItems.map((c) => ({
          id: c.id,
          title: c.title,
          image: c.imageUrl,
          subtitle: `Explore our ${c.title.toLowerCase()}`,
        }))}
        autoPlayMs={5000}
        className="w-full"
      />
      <NewArrivals />
      <Categories />
      <Afterpay />
    </>
  );
}
