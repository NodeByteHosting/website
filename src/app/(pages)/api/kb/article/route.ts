import { fetchKbPages } from "@/utils/github/getKbAssets";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    const repoOwner = 'NodeByteHosting';
    const repoName = 'assets/contents';
    const articlesJson = 'markdown/kb/articles.json?ref=main';

    const result = await fetchKbPages({
        repoName: repoName as string,
        repoOwner: repoOwner as string,
        articlesJson: articlesJson as string,
        slug: slug as string
    });

    return NextResponse.json(result, {
        headers: {
            "Cache-Control": "no-store"
        }
    });
}