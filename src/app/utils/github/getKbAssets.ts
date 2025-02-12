interface KbProps {
    repoOwner: string;
    repoName: string;
    articlesJson: string;
    slug: string;
}

export async function fetchKbPages({ repoOwner, repoName, articlesJson, slug }: KbProps) {

    const apiUrl = process.env.GITHUB_API_URL;
    const apiKey = process.env.GITHUB_PAT;

    const url = `${apiUrl}/${repoOwner}/${repoName}/${articlesJson}`;

    try {

        const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });

        if (!response.ok) {
            return {
                status: 'ERROR',
                message: `Whoops, we are unable to load that article at this time. Please try again later!`,
                code: 500
            }
        }

        const articlesJsonContent = await response.json();
        const decodedContent = Buffer.from(articlesJsonContent.content, 'base64').toString('utf-8');
        const sections = JSON.parse(decodedContent);

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
            return {
                status: 'NOT_FOUND',
                message: 'Sorry we are unable to locate that article in our Knowledge Base!',
                code: 404
            };
        }

        const articlePath = `${apiUrl}/${repoOwner}/${repoName}/markdown/kb/${article.path}.md?ref=main`;
        const articleResponse = await fetch(articlePath, { headers: { Authorization: `Bearer ${apiKey}` } });

        if (!articleResponse.ok) {
            return {
                status: 'ERROR',
                message: 'Whoops, we are unable to load that article at this time. Please try again later!',
                code: 500
            };
        }

        const fileContent = await articleResponse.json();
        const decodedFile = Buffer.from(fileContent.content, 'base64').toString('utf-8');


        return {
            status: 'OK',
            message: 'Successfully fetched article from Knowledge Base',
            article: decodedFile,
            title: articleTitle,
            description: articleDescription,
            code: 200
        };
    } catch (err: unknown) {
        return {
            status: 'ERROR',
            message: (err as Error).message ?? 'An unknown error occurred',
            code: 500
        }
    }
}