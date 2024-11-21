import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: 'OK',
        message: 'Welcome to the NodeByte Hosting Internal API.',
        code: 200
    })
}