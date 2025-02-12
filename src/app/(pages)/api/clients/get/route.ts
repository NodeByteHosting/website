import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { whmcs } from "@/src/app/utils/whmcs";

export async function GET(req: NextRequest) {

    const data = await whmcs.get('Clients').then(clients => clients).catch(err => console.error('Error:', err));

    return NextResponse.json({
        status: 'OK',
        clients: data,
        code: 200
    })
}