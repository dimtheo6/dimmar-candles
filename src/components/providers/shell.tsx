"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import CartSidebar from "@/components/cart/cartSidebar";
import Footer from "@/components/footer";

const AUTH_PATHS = ["/login", "/register", "/register_success"];
const ADMIN_PATHS = ["/admin"]

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuth = AUTH_PATHS.includes(pathname);
  const isAdmin = ADMIN_PATHS.includes(pathname);

  return (
    <>
      {!isAuth && !isAdmin  && <Header />}
      {children}
      {!isAuth && !isAdmin && <CartSidebar />}
      {!isAuth && !isAdmin && <Footer />}
    </>
  );
}
