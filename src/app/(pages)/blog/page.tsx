import BlogsListPage from "./layouts/LatestPosts";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Blog',
    description:
        'Stay updated with the latest blog posts.',
    openGraph: {
        type: 'website',
        'locale': 'en_US',
        url: 'https://nodebyte.host'
    },
    twitter: {
        site: '@NodeByteHosting',
        card: 'summary_large_image',
        creator: '@TheRealToxicDev',
        images: ['/banner.png']
    }
};


export default function BlogHome() {
    return <BlogsListPage />
}