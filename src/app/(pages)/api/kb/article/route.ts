import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    const baseUrl = process.env.GITHUB_API_URL;
    const repoOwner = 'NodeByteHosting';
    const repoName = 'assets';
    const filePath = 'markdown/kb/articles.json';
    const branch = 'main';

    const url = `${baseUrl}${repoOwner}/${repoName}/${branch}/${filePath}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            return NextResponse.json({
                status: 'ERROR',
                message: response.statusText,
                code: 500
            });
        }
        const articlesFileContent = await response.json();
        const sections = articlesFileContent;

        let article = null;
        let articleTitle = '';
        let articleDescription = '';

        for (const section of sections) {
            article = section.articles.find((article: any) => article.slug === slug);
            if (article) {
                articleTitle = article.title;
                articleDescription = article.description;
                break;
            }
        }

        if (!article) {
            return NextResponse.json({
                status: 'OK',
                message: 'Unable to locate that article in our knowledge base!',
                code: 404
            });
        }

        const articlePath = `${baseUrl}${repoOwner}/${repoName}/${branch}/markdown/kb/${article.path}.md`;
        const fileResponse = await fetch(articlePath);
        if (!fileResponse.ok) {
            return NextResponse.json({
                status: 'ERROR',
                message: fileResponse.statusText,
                code: 500
            });
        }
        const fileContent = await fileResponse.text();

        return NextResponse.json({
            status: 'OK',
            message: "Successfully fetched article from Knowledge base",
            article: fileContent,
            title: articleTitle,
            description: articleDescription,
            code: 200
        });
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
            message: 'Unknown error occurred',
            code: 500
        });
    }
}