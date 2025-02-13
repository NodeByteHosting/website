import { NextRequest, NextResponse } from 'next/server';
import Axios from 'axios';

const uptimeRobotToken = process.env.UR_API_KEY;

export async function POST(req: NextRequest) {

    let urlencoded = new URLSearchParams();
    urlencoded.append('api_key', uptimeRobotToken as string);
    urlencoded.append('response_times', '1');
    urlencoded.append('custom_uptime_ratios', '7-30');

    try {
        let monitors = await Axios.post(`https://api.uptimerobot.com/v2/getMonitors`, urlencoded, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'cache-control': 'no-cache'
            }
        });

        let m = monitors.data.monitors;

        m.forEach((monitor: any) => {
            if (monitor.url !== undefined) {
                delete monitor.url;
            }
        });

        return NextResponse.json(m, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        console.error(`Error: ${(err as Error).stack}`);
        return NextResponse.json({ error: 'Error fetching monitors' }, { status: 500 });
    }
}