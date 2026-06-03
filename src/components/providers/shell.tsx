"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import CartSidebar from "@/components/cart/cartSidebar";
import Footer from "@/components/footer";

const AUTH_PATHS = ["/login", "/register", "/register_success"];

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.includes(pathname);

  return (
    <>
      {!isAuth && <Header />}
      {children}
      {!isAuth && <CartSidebar />}
      {!isAuth && <Footer />}
    </>
  );
}
