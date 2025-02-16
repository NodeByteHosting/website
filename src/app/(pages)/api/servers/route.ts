import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { whmcs } from "utils/whmcs";

export async function GET(req: NextRequest) {

    const searchParams = req.nextUrl.searchParams;
    const count = searchParams.get('count');

    if (typeof count !== 'string' || (count !== 'true' && count !== 'false')) {
        return NextResponse.json({
            status: 'ERROR',
            message: 'Count query parameter should be a valid boolean.',
            code: 400
        });
    }

    const data = await whmcs.get('Servers').then(servers => servers).catch(err => console.error('Error:', err));

    const mappedServers = await data.servers.map((server: any) => ({
        id: server.id,
        name: server.name,
        active: server.active,
        module: server.module,
        services: {
            active: server.activeServices,
            allowed: server.maxAllowedServices
        },
        status: {
            http: server.status.http,
            load: server.status.load,
            uptime: server.status.uptime
        }

    }))

    if (count === 'true') {

        return NextResponse.json({
            status: 'OK',
            servers: data.servers.length + ' total servers',
            code: 200
        });
    }

    return NextResponse.json({
        status: 'OK',
        servers: mappedServers,
        code: 200
    })
}