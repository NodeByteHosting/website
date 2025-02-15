import { whmcs } from "utils/whmcs";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { logErrorToDiscord } from "utils/logError";

export async function GET(req: NextRequest) {
    const data = await whmcs.get('Announcements').then(announcements => announcements).catch(err => console.error('Error:', err));

    if (!data.ok) {
        await logErrorToDiscord({
            title: "Error: failed to fetch",
            message: "Please visit: [whmcs settings](https://billing.nodebyte.host/admin/configgeneral.php?nocache=q5WqdlN5rmxjKjgL#tab=10) and whitelist the IP Address for the host machine to fix this error!",
            source: "[LogiQ]: RESTRICTED_IP",
            page: "/api/support/announcements/get",
            status: 500
        })

        return NextResponse.json({
            status: 'ERROR',
            message: "Looks like our developers spilled some coffee on the server again, please bare with us!",
            code: 500
        })
    }

    return NextResponse.json({
        status: 'OK',
        announcements: data,
        code: 200
    })
}