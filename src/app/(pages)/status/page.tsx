import { StatusLayout } from './layouts/Status';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Status",
    description: 'Check the status of our services and any ongoing maintenance.',
    openGraph: {
        title: 'NodeByte Hosting',
        description: 'Check the status of our services and any ongoing maintenance.',
        url: 'https://nodebyte.host/status',
        siteName: 'NodeByte Hosting',
        locale: 'en_US',
        type: 'website',
    },
    twitter: {
        title: 'NodeByte Hosting',
        description: 'Check the status of our services and any ongoing maintenance.',
        images: 'https://nodebyte.host/banner.png',
        card: 'summary_large_image'
    },
    alternates: {
        canonical: 'https://nodebyte.host/status'
    }
};


export default function StatusPage() {
    return <StatusLayout />
}