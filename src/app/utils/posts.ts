import fs from 'fs';
import matter from 'gray-matter';
import { join } from 'path';

const BLOG_DIR = join(process.cwd(), 'content/blog');

interface Post {
    slug: string;
    title: string;
    date: string;
    description: string;
    content: string;
}

const load = async (): Promise<Post[]> => {
    const files = fs.readdirSync(BLOG_DIR);

    const posts = await Promise.all(
        files
            .filter((filename: string) => filename.endsWith('.mdx'))
            .map(async (filename: string) => {
                const slug = filename.replace('.mdx', '');
                return await findPostBySlug(slug);
            })
    );

    return posts.filter((post): post is Post => post !== null);
};

let _posts: Promise<Post[]> | null = null;

export const fetchPosts = async (): Promise<Post[]> => {
    _posts = _posts || load();
    return await _posts;
};

export const findLatestPosts = async ({ count }: { count?: number } = {}): Promise<Post[]> => {
    const _count = count || 4;
    const posts = await fetchPosts();
    return posts.slice(-_count);
};

export const findPostBySlug = async (slug: string): Promise<Post | null> => {
    if (!slug) return null;

    try {
        const readFile = fs.readFileSync(join(BLOG_DIR, `${slug}.mdx`), 'utf-8');
        const { data: frontmatter, content } = matter(readFile);
        return {
            slug,
            title: frontmatter.title,
            date: frontmatter.date,
            description: frontmatter.description,
            content,
        };
    } catch (e) {
        console.error(`Error reading post with slug ${slug}:`, e);
        return null;
    }
};

export const findPostsByIds = async (ids: string[]): Promise<Post[]> => {
    if (!Array.isArray(ids)) return [];

    const posts = await fetchPosts();

    return ids.reduce<Post[]>((result, id) => {
        const post = posts.find((post) => post.slug === id);
        if (post) result.push(post);
        return result;
    }, []);
};