import { NextResponse } from "next/server"
import { getAllOverrides, setOverride } from "@/packages/core/products/override-store"
import type { ProductOverride } from "@/packages/core/products/override-store"

export async function GET() {
  return NextResponse.json(getAllOverrides())
}

export async function PATCH(request: Request) {
  let body: { id?: string } & Partial<ProductOverride>

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const { id, stock, enabled } = body

  if (!id || stock === undefined || enabled === undefined) {
    return NextResponse.json(
      { error: "id, stock and enabled are required" },
      { status: 400 },
    )
  }

  setOverride(id, { stock, enabled })
  return NextResponse.json({ ok: true })
}
