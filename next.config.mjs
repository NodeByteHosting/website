/** @type {import('next').NextConfig} */
import { withContentlayer } from 'next-contentlayer2';
import { resolve } from 'path';

export default withContentlayer({
    compress: true,
    reactStrictMode: false,
    cacheHandler: resolve('./src/lib/cache.js'),
    cacheMaxMemorySize: 64 * 1024 * 1024, // 64 MB
    turbopack: {
        rules: {
            '*.sass': {
                loaders: ['sass-loader'],
                options: {
                    implementation: import('sass')
                }
            }
        },
        resolveImports: true
    },
    experimental: {
        optimizePackageImports: ['cobe'],
        optimisticClientCache: true
    },
    images: {
        dangerouslyAllowSVG: true,
        deviceSizes: [320, 420, 768, 1024, 1200, 1920],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cordximg.host"
            },
            {
                protocol: "https",
                hostname: "user-images.trustpilot.com"
            },
            {
                protocol: "https",
                hostname: "source.unsplash.com"
            },
            {
                protocol: "https",
                hostname: "toxicdev.me"
            }
        ]
    },
    env: {
        API_URL: process.env.API_URL,
        API_SHORT_URL: process.env.API_SHORT_URL,
        API_IDENTIFIER: process.env.API_IDENTIFIER,
        API_SECRET: process.env.API_SECRET,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        HETRIX_API_KEY: process.env.HETRIX_API_KEY,
        GITHUB_API_URL: process.env.GITHUB_API_URL,
        GITHUB_PAT: process.env.GITHUB_PAT,
        ERROR_HOOK_ID: process.env.ERROR_HOOK_ID,
        ERROR_HOOK_TOKEN: process.env.ERROR_HOOK_TOKEN,
        TAWK_TO_EMBED_URL: process.env.TAWK_TO_EMBED_URL,
        UR_API_KEY: process.env.UR_API_KEY,
    },
    webpack(config) {
        config.ignoreWarnings = config.ignoreWarnings || [];
        config.ignoreWarnings.push((warning) => {
            const msg = (warning && (warning.message || warning)) || '';
            // match the Contentlayer generate-dotpkg parsing warning
            return /generate-dotpkg\.js for build dependencies failed/.test(String(msg));
        });
        return config;
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: securityHeaders
            }
        ]
    }
})

const securityHeaders = [
    {
        key: 'X-Powered-By',
        value: 'NodeByte LTD'
    },
    {
        key: 'Powered-By',
        value: 'NodeByte LTD'
    },
    {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin'
    },
    {
        key: 'Content-Security-Policy',
        value: "frame-ancestors 'self' https://tawk.to https://toxicdev.me;"
    }
]
