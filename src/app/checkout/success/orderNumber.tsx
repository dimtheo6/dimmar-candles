"use client";
import { useEffect, useState } from "react";

export default function OrderNumber() {
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    setOrderNumber(`#DIM-${Date.now().toString().slice(-8)}`);
  }, []);

  return (
    <p className="font-medium text-neutral-900">{orderNumber}</p>
  );
}
