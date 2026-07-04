import { NextResponse } from "next/server";
import { getOrders } from "@/lib/orders";

export async function GET() {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (err) {
    console.error("[api/orders] failed to fetch orders", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
