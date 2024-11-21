import { Announcements } from './layouts/Announcements';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Announcements',
    description:
        'Stay up to date with the latest news and updates from NodeByte Hosting.',
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


export default function AnnouncementsPage() {
    return <Announcements />
}