import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const repoOwner = 'NodeByteHosting';
    const repoName = 'assets';
    const filePath = 'markdown/kb/articles.json';
    const branch = 'main';

    const url = `${process.env.GITHUB_API_URL}${repoOwner}/${repoName}/${branch}/${filePath}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return NextResponse.json({
                status: 'ERROR',
                message: response.statusText,
                code: 500
            });
        }
        const fileContent = await response.json();

        return NextResponse.json({
            status: 'OK',
            articles: fileContent,
            code: 200
        });
    } catch (error: unknown) {

        if (error instanceof Error) {
            return NextResponse.json({
                status: 'ERROR',
                message: error.message,
                code: 500
            });
        }

        return NextResponse.json({
            status: 'ERROR',
            message: 'An unknown error occurred',
            code: 500
        });
    }
}