import { StatusLayout } from './layouts/Status';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Status',
    description: 'Check the status of our services and any ongoing maintenance.',
};


export default function StatusPage() {
    return <StatusLayout />
}