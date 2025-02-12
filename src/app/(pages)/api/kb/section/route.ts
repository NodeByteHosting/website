import { NextResponse, NextRequest } from "next/server";
import { fetchKbSection } from "@/utils/github/getKbSection";

export async function GET(req: NextRequest) {
    const params = req.nextUrl.searchParams;
    const slug = params.get('slug');

    const repoOwner = 'NodeByteHosting';
    const repoName = 'assets/contents';
    const jsonPath = 'markdown/kb/articles.json?ref=main';

    const result = await fetchKbSection({
        repoOwner: repoOwner as string,
        repoName: repoName as string,
        jsonPath: jsonPath as string,
        slug: slug as string
    });

    return NextResponse.json(result, {
        headers: {
            'Cache-Control': 'no-store'
        }
    });
}