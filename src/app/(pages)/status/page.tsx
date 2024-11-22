import { StatusLayout } from './layouts/Status';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Status',
    description: 'Check the status of our services and any ongoing maintenance.',
    openGraph: {
        type: 'website',
        'locale': 'en_US',
        url: 'https://nodebyte.host/status'
    },
    twitter: {
        site: '@NodeByteHosting',
        card: 'summary_large_image',
        creator: '@TheRealToxicDev',
        images: ['/banner.png']
    }
};


export default function StatusPage() {
    return <StatusLayout />
}