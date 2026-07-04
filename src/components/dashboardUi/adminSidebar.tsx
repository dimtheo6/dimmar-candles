import React from "react";
import { courgette } from "@/lib/fonts";
import Link from "next/link";

function AdminSidebar() {
  return (
    <div className="sticky left-0 top-0 min-h-screen py-5 px-10 bg-stone-100 shadow-2xl">
      <Link href={"/"} className={`${courgette.className} text-2xl`}>Dimmar</Link>
      <p className="text-sm text-stone-600">Admin Page</p>
    </div>
  );
}

export default AdminSidebar;
