import React from "react";
import { courgette } from "@/lib/fonts";
import Link from "next/link";
import CartButton from "./cart/cartButton";

function Header() {
  return (
    <header className=" bg-white border-b border-neutral-200 sticky top-0 z-30 select-none">
      {/* Top announcement bar */}
      <div className="bg-neutral-50 text-center py-2">
        <p className="text-xs text-neutral-600 tracking-wide">
          Free shipping above $100 or $9 flat rate
        </p>
      </div>

      {/* Main header */}
      <div className=" max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href={"/"} className="group">
            <h1
              className={`${courgette.className} text-2xl text-neutral-900 group-hover:text-neutral-600 transition-colors`}
            >
              Dimmar
            </h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-12">
            <Link
              href={"/"}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Home
            </Link>
            <Link
              href={"/candles"}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Products
            </Link>
            <Link
              href={"/about"}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              About
            </Link>
            <Link
              href={"/contact-us"}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Contact
            </Link>
          </nav>

            <CartButton />
   
        </div>
      </div>
    </header>
  );
}

export default Header;
