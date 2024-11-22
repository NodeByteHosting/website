import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {

    const repoOwner = "NodeByteHosting";
    const repoName = "assets";
    const filePath = "markdown/legal/privacy.md";
    const branch = 'main';

    const url = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${filePath}`;

    try {

        const res = await fetch(url);

        if (!res.ok) {
            return NextResponse.json({
                status: 'ERROR',
                message: 'Failed to fetch data from assets repo',
                code: 500
            })
        }

        const fileContent = await res.text();

        return NextResponse.json({
            status: 'OK',
            content: fileContent,
            code: 200
        })
    } catch (err: unknown) {

        if (err instanceof Error) {
            return NextResponse.json({
                status: 'ERROR',
                message: err.message,
                code: 500
            });
        }

        return NextResponse.json({
            status: 'ERROR',
            message: "An unknown error occurred",
            code: 500
        });
    }
}