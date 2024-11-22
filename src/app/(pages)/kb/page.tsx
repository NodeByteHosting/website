import { KnowledgeBaseLayout } from './layouts/KnowledgeBase';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Knowledge Base',
    description:
        'Welcome to the NodeByte Knowledge Base! Here you can find all the information you need to get started with our services.',
    openGraph: {
        type: 'website',
        'locale': 'en_US',
        url: 'https://nodebyte.host'
    },
    twitter: {
        site: '@NodeByteHosting',
        card: 'summary_large_image',
        creator: '@TheRealToxicDev'
    }
};


export default function KnowledgeBase() {
    return <KnowledgeBaseLayout />
}