interface SectionProps {
    repoOwner: string;
    repoName: string;
    jsonPath: string;
    slug: string;
}

export async function fetchKbSection({ repoOwner, repoName, jsonPath, slug }: SectionProps) {

    const apiUrl = process.env.GITHUB_API_URL;
    const apiKey = process.env.GITHUB_PAT;

    const url = `${apiUrl}/${repoOwner}/${repoName}/${jsonPath}`;

    try {
        const response = await fetch(url, { headers: { Authorization: `Bearer ${apiKey}` } });

        if (!response.ok) {
            return {
                status: 'ERROR',
                message: 'Whoops, we are unable to load that section at this time. Please try again later!',
                code: 500
            };
        }

        const jsonFileContent = await response.json();
        const decodedContent = await Buffer.from(jsonFileContent.content, 'base64').toString('utf-8');
        const sections = JSON.parse(decodedContent);

        const section = sections.find((section: any) => section.slug === slug);

        if (!section) {
            return {
                status: 'OK',
                message: 'Sorry we are unable to locate that section in our Knowledge Base',
                code: 404
            };
        }

        return {
            status: 'OK',
            message: 'Successfully fetched section',
            section: section.section,
            about: section.about,
            articles: section.articles.length > 0 ? section.articles : 'No articles available, check back later',
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