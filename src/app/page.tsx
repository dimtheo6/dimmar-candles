"use client";

import Afterpay from "@/components/afterpay";
import Categories from "@/components/categories";
import Carousel from "@/components/carousel";
import { categories } from "@/constants";
import NewArrivals from "@/components/newArrivalsList";

export default function Home() {
  return (
    <>
      <Carousel
        items={categories.map((c) => ({
          id: c.id,
          title: c.text,
          image: c.img,
          subtitle: `Explore our ${c.text.toLowerCase()}`,
          
        }))}
        autoPlayMs={5000}
      className="w-full"/>
      <NewArrivals/>
      <Categories />
      <Afterpay />
    </>
  );
}
