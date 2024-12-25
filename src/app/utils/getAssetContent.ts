
/**
 * Fetch the contents of a file from a Github Repository
 * @param repoOwner The owner of the repo/org name (ex: NodeByteHosting)
 * @param repoName The name of the repo to fetch (ex: website)
 * @param filePath The path to the file to fetch (ex: markdown/legal/cookies.md?ref=main)
 * 
 * @important Please make sure you provide a reference to the branch in the file path (ex: ?ref=main) 
 */
export async function fetchGithubContent(repoOwner: string, repoName: string, filePath: string) {

    const apiUrl = process.env.GITHUB_API_URL;
    const apiKey = process.env.GITHUB_PAT;

    const url = `${apiUrl}/${repoOwner}/${repoName}/${filePath}`;

    try {

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${apiKey}` }
        });

        if (!res.ok) {
            return {
                status: 'ERROR',
                message: `Failed to fetch data from assets repo`,
                code: 500
            };
        }

        const fileContent = await res.json();

        // Decode the base64 file content
        const decodedContent = Buffer.from(fileContent.content, 'base64').toString('utf-8');

        return {
            status: 'OK',
            content: decodedContent,
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