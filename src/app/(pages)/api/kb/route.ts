import { fetchGithubArticlesList } from "@/src/app/utils/github/getArticlesList";
import { NextResponse } from "next/server";
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
    const repoOwner = 'NodeByteHosting';
    const repoName = 'assets/contents';
    const filePath = 'markdown/kb/articles.json?ref=main';

    const result = await fetchGithubArticlesList({
        repoOwner: repoOwner as string,
        repoName: repoName as string,
        jsonPath: filePath as string
    });

    return NextResponse.json(result, {
        headers: {
            'Cache-Control': 'no-store'
        }
    });
}