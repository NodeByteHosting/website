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

        const filtered = data.monitors.map((monitor: any) => ({
            id: monitor.id,
            name: monitor.name,
            type: monitor.type,
            uptime_status: monitor.uptime_status,
            monitor_status: monitor.monitor_status,
            uptime: monitor.uptime,
            resolve_address_info: monitor.resolve_address_info,
            locations: monitor.locations
        }))

        return NextResponse.json({
            status: 'OK',
            monitors: filtered,
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