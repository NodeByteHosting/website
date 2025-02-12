import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Connected to the Tawk API Successfully" });
}

export async function POST(req: Request) {
    const { action } = await req.json();

    if (typeof window !== "undefined" && window.Tawk_API) {
        if (action === "hide") window.Tawk_API.hide();
        if (action === "show") window.Tawk_API.show();
    }

    return NextResponse.json({ success: true })
}