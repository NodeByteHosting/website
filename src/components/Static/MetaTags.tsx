import Head from 'next/head';

interface Props {
    title: string;
    description: string;
}

export const MetaTags = ({ title, description }: Props) => {

    return (
        <Head>
            <title>{title}</title>
            <meta name="msapplication-TileColor" content="#4f46e5" />
            <meta name="theme-color" content="#4f46e5" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="Content-Language" content="en" />
            <meta name="description" content={description} />
            <meta name="og:description" content={description} />
            <meta name="og:title" content={title} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="https://twitter.com/NodeByteHosting" />
            <meta name="twitter:creator" content="@TheRealToxicDev" />
            <meta name="twitter:image" content="/banner.png" />
            <meta property="og:site_name" content="NodeByte"></meta>
            <meta name="apple-mobile-web-app-title" content={title} />
            <link rel="apple-touch-icon" sizes="180x180" href='/logo.png' />
            <link rel="manifest" href="/app/manifest.json" />
            <link rel="apple-touch-icon" href="/logo.png" />
            <meta name="theme-color" content="#4f46e5" />
            <link rel="icon" sizes="192x192" href='/logo.png' />
            <link rel="icon" sizes="32x32" href='/logo.png' />
            <link rel="icon" sizes="96x96" href='/logo.png' />
            <link rel="icon" sizes="16x16" href='/logo.png' />
            <link rel="icon" href='/logo.png' type="image/x-icon" />
            <meta name="msapplication-TileImage" content='/logo.png' />
        </Head>
    )
}