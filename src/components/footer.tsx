import Link from "next/link";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faLinkedin,
  faFacebook,
} from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";

function Footer() {
  return (
    <div className="bg-neutral-100 border-t border-neutral-200 mt-20 p-10">
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold">Help & Support</h3>
        <ul className="font-medium text-neutral-600 [&>li>a]:hover:text-black [&>li]:hover:transition-colors">
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

      <div className="flex flex-col sm:flex-row justify-between items-center mt-10 gap-3 ">
        {/* Social Media Links */}
        <div className="flex gap-2 mt-auto text-2xl">
          <Link href="https://www.instagram.com/" target="blank" className="hover:text-[#da0d9d] transition-colors">
            <FontAwesomeIcon icon={faInstagram} />
          </Link>
          <Link href="https://www.linkedin.com/" target="blank" className="hover:text-[#0462c0] transition-colors">
            <FontAwesomeIcon icon={faLinkedin} />
          </Link>
          <Link href="https://www.facebook.com/" target="blank" className="hover:text-[#0866ff] transition-colors">
            <FontAwesomeIcon icon={faFacebook} />
          </Link>
        </div>

        {/* Payment Options */}
        <div className="space-y-2">
          <h3 className="text-lg">We accept</h3>
          <div className="flex gap-2">
            <Image
              src="/payment_symbols/mastercard.svg"
              alt="Mastercard"
              className="border p-1 border-black/10 rounded"
              width={40}
              height={20}
            />

            <Image
              src="/payment_symbols/visa.svg"
              alt="Visa"
              className="border  border-black/10 rounded"
              width={40}
              height={20}
            />

            <Image
              src="/payment_symbols/google.svg"
              alt="Google Pay"
              className="border  border-black/10 rounded"
              width={40}
              height={20}
            />

            <Image
              src="/payment_symbols/apple.svg"
              alt="Apple Pay"
              className="border border-black/10 rounded"
              width={40}
              height={20}
            />

            <Image
              src="/payment_symbols/paypal.svg"
              alt="PayPal"
              className="border px-3 border-black/10 rounded"
              width={40}
              height={20}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
