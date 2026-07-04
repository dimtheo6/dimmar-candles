"use client";

import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AdminSidebar from "@/components/dashboardUi/adminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/");
      return;
    }

    (async () => {
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const role = userDoc.data()?.role;

      if (role !== "admin") {
        router.replace("/");
        return;
      }

      setIsAdmin(true);
      setChecking(false);
    })();
  }, [user, loading, router]);

  if (loading || checking) return null;

  return isAdmin ? (
    <div className="flex">
      {" "}
      <AdminSidebar/>
      {children}
    </div>
  ) : null;
}
