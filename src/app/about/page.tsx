import React from "react";

function page() {
  return (
    <div className="max-w-lg mx-auto px-6 py-10 space-y-6 leading-relaxed text-md [&>div]:text-neutral-600  ">
      <h1 className="text-2xl font-bold text-center">About Us</h1>
      <div>
        Dimmar is an online marketplace where you can find Australia’s best
        selection of scented candles and incense.
      </div>
      <div>
        We are a team of artisans dedicated to crafting beautiful, hand-poured
        candles in Australia. Each candle is made with love and care, using only
        the highest quality ingredients to create unique scents that enhance
        your living space.
      </div>
      <div>
        Quite simply, we love candles. A candle is special. No matter how
        advanced our world becomes, nothing will replace it. The feeling of calm
        and comfort that comes with lighting a wick and letting the aroma unfold
        around you, becoming entranced by the flicker of the flame – that can
        never be replicated.
      </div>
      <div>
        Dimmar began with a simple idea – to slow down and bring warmth into
        everyday moments. What started as small batches of hand-poured candles
        for family and friends has grown into a passionate craft, inspired by
        Australia’s natural beauty and scents.
      </div>
      <div>
        We’d love to be part of your story too. Whether it’s a gift, a moment of
        self-care, or simply adding beauty to your space, our candles are made
        to be shared and cherished.
      </div>
      <picture>
        <img
          src="/images/about-us.png"
          alt="About Us"
          className="w-full h-auto rounded-lg shadow-md"
        />
      </picture>
    </div>
  );
}

export default page;
