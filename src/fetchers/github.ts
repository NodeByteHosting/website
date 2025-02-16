import CacheHandler from 'cache';

interface FetcherProps {
    repoOwner: string;
    repoName: string;
    jsonPath: string;
    slug?: string;
    type: 'articles' | 'section' | 'page';
}

const getGithubApiUrl = () => process.env.GITHUB_API_URL;
const getGithubAccessToken = () => process.env.GITHUB_PAT;

const cache = new CacheHandler({ ttl: 5 * 60 * 1000, maxSize: 500 });

export const githubFetcher = async ({ repoOwner, repoName, jsonPath, slug, type }: FetcherProps) => {
    const apiUrl = getGithubApiUrl();
    const apiKey = getGithubAccessToken();
    const cacheKey = `Cache:GitHub_${repoOwner}_${repoName}_${type}_${slug ?? 'all'}`;

    let cachedData = await cache.get(cacheKey);
    if (cachedData) return cachedData;

    try {
        const url = `${apiUrl}/${repoOwner}/${repoName}/${jsonPath}`;
        const response = await fetch(url, {
            headers: { Authorization: `Bearer ${apiKey}` },
        });

        if (!response.ok) {
            throw new Error(`GitHub API request failed: ${response.statusText}`);
        }

        const fileContent = await response.json();

        if (!fileContent.content) {
            throw new Error('Unable to decode or locate the article content');
        }

        const decodedContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');
        const data = JSON.parse(decodedContent);

        let result: any;

        if (type === 'articles') {
            result = data;
        } else if (type === 'section') {
            const section = data.find((section: any) => section.slug === slug);
            if (!section) throw new Error('Section not found');
            result = section;
        } else if (type === 'page') {
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

            if (!article) throw new Error('Article not found');

            const articlePath = `${apiUrl}/${repoOwner}/${repoName}/markdown/kb/${article.path}.md`;
            const articleResponse = await fetch(articlePath, {
                headers: { Authorization: `Bearer ${apiKey}` },
            });

            if (!articleResponse.ok) throw new Error('Unable to fetch article content');

            const articleFileContent = await articleResponse.json();
            if (!articleFileContent.content) throw new Error('Unable to decode article content');

            const decodedArticleFile = Buffer.from(articleFileContent.content, 'base64').toString('utf-8');

            result = {
                article: decodedArticleFile,
                title: articleTitle,
                description: articleDescription,
            };
        } else {
            throw new Error('Invalid fetch type');
        }

        await cache.set(cacheKey, result, { tags: [`GitHub:${repoOwner}/${repoName}`] });

        return result;
    } catch (err) {
        throw new Error((err as Error).message ?? 'An unknown error occurred');
    }
};