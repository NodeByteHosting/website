import { Signin } from './layouts/Signin';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Sign In',
    description:
        'Sign in to your NodeByte Hosting account.',
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

export default function SignIn() {
    return <Signin />;
}