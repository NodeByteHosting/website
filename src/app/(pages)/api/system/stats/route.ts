import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { whmcs } from "@/src/app/utils/whmcs";

export async function GET(req: NextRequest) {
    const data = await whmcs.get('Stats').then(stats => stats).catch(err => console.error('Error:', err));

    return NextResponse.json({
        status: 'OK',
        stats: data,
        code: 200
    })
}