import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get('slug');

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
        const articlesFileContent = await response.json();
        const sections = articlesFileContent;

        const section = sections.find((section: any) => section.slug === slug);

        if (!section) {
            return NextResponse.json({
                status: 'OK',
                message: 'Unable to locate that section in our knowledge base!',
                code: 404
            });
        }

        return NextResponse.json({
            status: 'OK',
            message: "Successfully fetched section",
            section: section.section,
            about: section.about,
            articles: section.articles,
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