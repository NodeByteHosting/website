import { KnowledgeBaseLayout } from 'layouts/Knowledgebase';
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Knowledge Base',
    description:
        'Welcome to the NodeByte Knowledge Base! Here you can find all the information you need to get started with our services.',
};


export default function KnowledgeBase() {
    return <KnowledgeBaseLayout />
}