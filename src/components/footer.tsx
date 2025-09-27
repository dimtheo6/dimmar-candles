import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <div className="bg-neutral-100 border-t border-neutral-200 mt-20 p-10">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold">Help & Support</h3>
        <ul className="text-sm text-neutral-600 hover:text-neutral-900 transition-colors">
          <li>
            <Link href="/faq">FAQ</Link>
          </li>
          <li>
            <Link href="/contact-us">Contact Us</Link>
          </li>
          <li>
            <Link href="/shipping-returns">Shipping & Returns</Link>
          </li>
          <li>
            <Link href="/privacy-policy">Privacy Policy</Link>
          </li>
          <li>
            <Link href="/terms-of-service">Terms of Service</Link>
          </li>
          <li>
            <Link href="/refund">Refunds</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
