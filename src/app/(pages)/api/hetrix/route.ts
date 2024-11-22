import { NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.HETRIX_API_KEY;
    const apiUrl = `https://api.hetrixtools.com/v3/uptime-monitors`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await response.json()

        return NextResponse.json({
            status: 'OK',
            monitors: data,
            code: 200
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            return NextResponse.json({
                status: 'ERROR',
                message: err.message,
                code: 500
            })
        }

        return NextResponse.json({
            status: 'ERROR',
            message: 'An unknown error occurred',
            code: 500
        })
    }
}