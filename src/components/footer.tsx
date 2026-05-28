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
    <footer className="bg-stone-900 text-stone-300 mt-20">
      {/* Main footer content */}
      <div className="max-w-6xl mx-auto px-8 py-14 grid grid-cols-1 sm:grid-cols-3 gap-10">
        {/* Brand column */}
        <div className="space-y-4">
          <h2 className="text-white text-xl font-bold tracking-wide">Dimmar</h2>
          <p className="text-sm leading-relaxed text-stone-400">
            Handcrafted candles and homewares made with care. Bringing warmth to
            every home.
          </p>
          <div className="flex gap-4 text-xl pt-1">
            <Link
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#da0d9d] transition-colors"
            >
              <FontAwesomeIcon icon={faInstagram} />
            </Link>
            <Link
              href="https://www.facebook.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0866ff] transition-colors"
            >
              <FontAwesomeIcon icon={faFacebook} />
            </Link>
            <Link
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#0462c0] transition-colors"
            >
              <FontAwesomeIcon icon={faLinkedin} />
            </Link>
          </div>
        </div>

        {/* Help & Support column */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold uppercase text-sm tracking-widest">
            Help & Support
          </h3>
          <ul className="space-y-2 text-sm">
            {[
              { href: "/contact-us", label: "Contact Us" },
              { href: "/refunds", label: "Refunds" },
              { href: "/privacy-policy", label: "Privacy Policy" },
              { href: "/terms-of-service", label: "Terms of Service" },
              { href: "/about", label: "About Us" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-stone-400 hover:text-white transition-colors"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div className="space-y-4">
          <h3 className="text-white font-semibold uppercase text-sm tracking-widest">
            Get in Touch
          </h3>
          <ul className="space-y-2 text-sm text-stone-400">
            <li>
              <a
                href="mailto:support@dimmar.com"
                className="hover:text-white transition-colors"
              >
                support@dimmar.com
              </a>
            </li>
            <li>XX XXXX XXXX</li>
            <li className="pt-2 text-stone-500">
              Mon – Sat: 9am – 5pm
              <br />
              Sun: 10am – 4pm
            </li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-stone-700" />

      {/* Bottom bar */}
      <div className="max-w-6xl mx-auto px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-stone-500 text-xs">
          © {new Date().getFullYear()} Dimmar. All rights reserved.
        </p>

        {/* Payment icons */}
        <div className="flex items-center gap-2">
          <span className="text-stone-500 text-xs mr-1">We accept</span>
          {[
            { src: "/payment_symbols/visa.svg", alt: "Visa" },
            { src: "/payment_symbols/mastercard.svg", alt: "Mastercard" },
            { src: "/payment_symbols/paypal.svg", alt: "PayPal" },
            { src: "/payment_symbols/apple.svg", alt: "Apple Pay" },
            { src: "/payment_symbols/google.svg", alt: "Google Pay" },
          ].map(({ src, alt }) => (
            <div
              key={alt}
              className="bg-white rounded px-1.5 py-1 flex items-center justify-center"
            >
              <Image
                src={src}
                alt={alt}
                width={36}
                height={22}
                className="h-5 w-auto"
              />
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
