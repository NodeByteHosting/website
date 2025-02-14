import { NextRequest, NextResponse } from 'next/server';
import Axios from 'axios';

const uptimeRobotToken = process.env.UR_API_KEY;

export async function POST(req: NextRequest) {
    let urlencoded = new URLSearchParams();
    urlencoded.append('api_key', uptimeRobotToken as string);
    urlencoded.append('response_times', '1');
    urlencoded.append('average_response_times', '1');
    urlencoded.append('all_time_uptime_ratio', '1');
    urlencoded.append('custom_uptime_ratios', '7-30');
    urlencoded.append('logs', '1');

    try {
        let monitorsResponse = await Axios.post(`https://api.uptimerobot.com/v2/getMonitors`, urlencoded, {
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'cache-control': 'no-cache'
            }
        });

        let monitors = monitorsResponse.data.monitors;

        monitors.forEach((monitor: any) => {
            if (monitor.url !== undefined) {
                delete monitor.url;
            }
        });

        return NextResponse.json(monitors, {
            headers: {
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (err) {
        console.error(`Error: ${(err as Error).stack}`);
        return NextResponse.json({ error: 'Error fetching monitors' }, { status: 500 });
    }
}