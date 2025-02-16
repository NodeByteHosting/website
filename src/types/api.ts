/**
 * Legal asset props
 */
export interface LegalAssetProps {
    title: string;
    content: string;
    lastModified: string;
}

/**
 * GitHub fetcher props
 */
export interface GitHubFetcherProps {
    owner: string;
    repo: string;
    path: string;
}

/**
 * JWT payload type
 */
export interface JWTPayload {
    id: string;
    email: string;
    name: string;
    role?: string;
}

/**
 * User type for authentication
 */
export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role?: string;
}

/**
 * Blog post type
 */
export interface Post {
    title: string;
    slug: string;
    content: string;
    excerpt?: string;
    date: string;
    author: {
        name: string;
        image?: string;
    };
    tags?: string[];
}
