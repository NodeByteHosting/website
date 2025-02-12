import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';
import { whmcs } from "@/src/app/utils/whmcs";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type');


    if (type === 'admins') {
        const admins = await whmcs.get('AdminUsers').then(admins => admins).catch(err => console.error('Error:', err));

        console.log(admins)

        const mappedAdmins = admins.admin_users.map((admin: any) => ({
            id: admin.id,
            username: admin.username,
            created: admin.createdAt,
            updated: admin.updatedAt,
            gravatar: admin.gravatarHash
        }))

        return NextResponse.json({
            status: 'OK',
            count: admins.count + ' total admins',
            admins: mappedAdmins
        })


    } else if (type === 'online') {
        const online = await whmcs.get('StaffOnline').then(online => online).catch(err => console.error(`Error:`, err));

        return NextResponse.json({
            status: 'OK',
            onlineStaff: online,
            code: 200
        })

    } else {
        return NextResponse.json({
            status: 'ERROR',
            message: 'Invalid request type query provided should be (admins or online)',
            code: 400
        })
    }
}