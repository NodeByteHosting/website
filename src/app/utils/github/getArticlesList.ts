import getConfig from 'next/config';

interface ArticlesListProps {
    repoOwner: string;
    repoName: string;
    jsonPath: string;
}

export async function fetchGithubArticlesList({ repoOwner, repoName, jsonPath }: ArticlesListProps) {

    const apiUrl = process.env.GITHUB_API_URL;
    const apiKey = process.env.GITHUB_PAT;

    const url = `${apiUrl}/${repoOwner}/${repoName}/${jsonPath}`;

    try {

        const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });

        if (!response.ok) {
            return {
                status: 'ERROR',
                message: 'Whoops, we are unable to load the articles list at this time. Please try again later!',
                code: 500
            };
        }

        const fileContent = await response.json();
        const decodedContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');
        const articlesList = JSON.parse(decodedContent);

        return {
            status: 'OK',
            message: 'Here is a list of available articles',
            articles: articlesList,
            code: 200
        };
    } catch (err: unknown) {
        return {
            status: 'ERROR',
            message: (err as Error).message ?? 'An unknown error occurred',
            code: 500
        };
    }
}