interface LegalAssetProps {
    repoOwner: string;
    repoName: string;
    filePath: string;
}

const getGithubApiUrl = () => {
    return process.env.GITHUB_API_URL;
};

const getGithubAccessToken = () => {
    return process.env.GITHUB_PAT;
};

export const fetchLegalPages = async ({ repoOwner, repoName, filePath }: LegalAssetProps) => {
    const apiUrl = getGithubApiUrl();
    const apiKey = getGithubAccessToken();

    const url = `${apiUrl}/${repoOwner}/${repoName}/${filePath}`;

    try {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${apiKey}`,
            },
        });

        if (!response.ok) {
            const errorMessage = `Failed to fetch data from GitHub: ${response.status} ${response.statusText}`;
            throw new Error(errorMessage);
        }

        const fileContent = await response.json();

        if (!fileContent.content) {
            throw new Error('Content not found in the response');
        }

        const decodedContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');

        return {
            status: 'OK',
            content: decodedContent,
            code: 200,
        };
    } catch (err: unknown) {
        return {
            status: 'ERROR',
            message: (err as Error).message ?? 'An unknown error occurred',
            code: 500,
        };
    }
};