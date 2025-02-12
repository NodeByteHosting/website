interface FetcherProps {
    repoOwner: string;
    repoName: string;
    jsonPath: string;
    slug?: string;
    type: 'articles' | 'section' | 'page';
}

const getGithubApiUrl = () => {
    return process.env.GITHUB_API_URL;
};

const getGithubAccessToken = () => {
    return process.env.GITHUB_PAT;
};

export const githubFetcher = async ({ repoOwner, repoName, jsonPath, slug, type }: FetcherProps) => {
    const apiUrl = getGithubApiUrl();
    const apiKey = getGithubAccessToken();

    const url = `${apiUrl}/repos/${repoOwner}/${repoName}/contents/${jsonPath}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from GitHub');
        }

        const fileContent = await response.json();
        const decodedContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');
        const data = JSON.parse(decodedContent);

        if (type === 'articles') {
            return data;
        }

        if (type === 'section') {
            const section = data.find((section: any) => section.slug === slug);
            if (!section) {
                throw new Error('Section not found');
            }
            return section;
        }

        if (type === 'page') {
            const sections = data;
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
                throw new Error('Article not found');
            }

            const articlePath = `${apiUrl}/repos/${repoOwner}/${repoName}/contents/markdown/kb/${article.path}.md?ref=main`;
            const articleResponse = await fetch(articlePath, {
                headers: {
                    Authorization: `Bearer ${apiKey}`,
                },
            });

            if (!articleResponse.ok) {
                throw new Error('Failed to fetch article content');
            }

            const articleFileContent = await articleResponse.json();
            const decodedArticleFile = Buffer.from(articleFileContent.content, 'base64').toString('utf-8');

            return {
                article: decodedArticleFile,
                title: articleTitle,
                description: articleDescription,
            };
        }

        throw new Error('Invalid fetch type');
    } catch (err: unknown) {
        throw new Error((err as Error).message ?? 'An unknown error occurred');
    }
};