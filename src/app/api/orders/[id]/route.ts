import { NextRequest, NextResponse } from "next/server";
import { updateOrderStatus } from "@/lib/orders";
import type { OrderRecord } from "@/lib/orders";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = (await req.json()) as { status: OrderRecord["status"] };
    if (!status) {
      return NextResponse.json({ error: "status is required" }, { status: 400 });
    }
    await updateOrderStatus(id, status);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[api/orders/[id]] failed to update status", err);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
