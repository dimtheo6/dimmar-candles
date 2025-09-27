import Link from "next/link";
import React from "react";

function page() {
  return (
    <div className="max-w-lg mx-auto px-6 py-10 space-y-6 leading-relaxed text-md [&>div]:text-neutral-600">
      <h1 className="text-2xl font-bold text-center">Refund Policy</h1>
      <div>
        We work hard to make high quality candles and we are dedicated to
        providing a clean burning candle. If you are unhappy with your order,
        please{" "}
        <Link href="/contact-us" className="underline underline-offset-4">
          get in touch
        </Link>{" "}
        with details of your order and a description of the issue, within 7 days
        of delivery.
      </div>
      <h2 className="text-lg font-bold">Returns</h2>
      <div>
        To return your items, please ensure the candles are in good condition
        (unused, in their original packaging & undamaged). All items are
        accepted at the discretion of our team.
      </div>
      <div>
        We are not able to offer exchanges and instead encourage you to place a
        new order for your desired item, and returning the original item for a
        refund.
      </div>
      <div>
        Please note we do not guarantee delivery times and cannot offer refunds
        based on delivery times.
      </div>
      <div>
        Sale items are not eligible for return or credit unless faulty. Please
        choose carefully, and if you have any questions regarding a sale item
        please contact our customer service team.
      </div>
      <h2 className="text-lg font-bold">Refunds</h2>
      <div>
        Your refund will be credited to your original payment method. Please
        note credit card refunds may take up to 10 days to process, depending on
        your financial institution.
      </div>
    </div>
  );
}

export default page;
