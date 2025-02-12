import { NextResponse, NextRequest } from "next/server";
import { fetchLegalPages } from "@/utils/github/getLegalAssets";

export async function GET(req: NextRequest) {

    const params = req.nextUrl.searchParams;
    const asset = params.get('asset');

    const repoOwner = "NodeByteHosting";
    const repoName = "assets/contents";
    const filePath = `markdown/legal/${asset}.md?ref=main`;

    const result = await fetchLegalPages({
        repoOwner: repoOwner as string,
        repoName: repoName as string,
        filePath: filePath as string
    });

    return NextResponse.json(result, {
        headers: { "Cache-Control": "no-store" }
    })
}