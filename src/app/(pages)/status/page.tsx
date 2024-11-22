import { StatusLayout } from './layouts/Status';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Status',
    description: 'Check the status of our services and any ongoing maintenance.',
};


export default function StatusPage() {
    return <StatusLayout />
}