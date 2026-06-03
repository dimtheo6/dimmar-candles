import React, { useEffect } from "react";
import { courgette } from "@/lib/fonts";
import Link from "next/link";
import CartButton from "./cart/cartButton";
import { faCircleUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { useState } from "react";

function Header() {
  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged in:", user);
        setLoggedUser(user);
        console.log("user is ", loggedUser);
      } else {
        console.log("Logged out");
        setLoggedUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  useEffect(() => {
    console.log("loggedUser changed:", loggedUser);
  }, [loggedUser]);

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
          <div className="flex items-center space-x-4">
            <div className="relative group inline-block">
              <Link href={loggedUser ? "" : "/login"}>
                <FontAwesomeIcon
                  icon={faCircleUser}
                  className="text-xl text-neutral-600 hover:text-neutral-900 transition-colors cursor-pointer"
                />
              </Link>

              {/* Dropdown menu */}
              <div className="hidden absolute top-5 -left-10 group-hover:flex flex-col border border-gray-100 bg-white text-sm py-2 px-5 shadow-lg z-50 gap-2 whitespace-nowrap cursor-pointer">
                {loggedUser ? (
                  <>
                  
                  <div className=" font-bold">{loggedUser?.email}</div>
                   <div className="border-b-[1px] border-gray-300"></div>
                <div className="text-neutral-600 hover:text-neutral-900">
                  My orders
                </div>
                <Link
                  href={"/"}
                  onClick={handleLogout}
                  className="text-neutral-600 hover:text-neutral-900"
                >
                  Sign Out
                </Link>
                  </>
                ) : (
                  <Link
                    href={"/login"}
                    className="whitespace-nowrap text-sm font-bold"
                  >
                    Sign in / Register
                  </Link>
                )}
               
              </div>
            </div>
            <CartButton />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
