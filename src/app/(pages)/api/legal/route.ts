import { NextResponse, NextRequest } from "next/server";
import { fetchGithubContent } from "@/utils/getAssetContent";

export async function GET(req: NextRequest) {

    const params = req.nextUrl.searchParams;
    const asset = params.get('asset');

    const repoOwner = "NodeByteHosting";
    const repoName = "assets/contents";
    const filePath = `markdown/legal/${asset}.md?ref=main`;

    const result = await fetchGithubContent(repoOwner, repoName, filePath);

    return NextResponse.json(result, {
        headers: { "Cache-Control": "no-store" }
    })
}