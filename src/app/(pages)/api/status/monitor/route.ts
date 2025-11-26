import { NextRequest, NextResponse } from 'next/server';
import Axios from 'axios';

const uptimeRobotToken = process.env.UR_API_KEY;

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const monitorId = searchParams.get("id");

    if (!monitorId) {
        return NextResponse.json({ error: "Monitor ID is required" }, { status: 400 });
    }

    let urlencoded = new URLSearchParams();
    urlencoded.append("api_key", uptimeRobotToken as string);
    urlencoded.append("response_times", "1");
    urlencoded.append("average_response_times", "1");
    urlencoded.append("all_time_uptime_ratio", "1");
    urlencoded.append("custom_uptime_ratios", "7-30");
    urlencoded.append("logs", "1");
    urlencoded.append("monitors", monitorId);

    try {
        let response = await Axios.post(
            "https://api.uptimerobot.com/v2/getMonitors",
            urlencoded,
            {
                headers: {
                    "content-type": "application/x-www-form-urlencoded",
                    "cache-control": "no-cache",
                },
            }
        );

        let monitors = response.data.monitors;

        if (!monitors || monitors.length === 0) {
            return NextResponse.json({ error: "Monitor not found" }, { status: 404 });
        }

        let monitor = monitors[0];

        // Clean up unnecessary data
        delete monitor.url;

        return NextResponse.json(monitor, {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
        });
    } catch (err) {
        console.error(`Error: ${(err as Error).stack}`);
        return NextResponse.json({ error: "Error fetching monitor data" }, { status: 500 });
    }
}