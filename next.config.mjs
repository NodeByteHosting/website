/** @type {import('next').NextConfig} */
import { withContentlayer } from 'next-contentlayer2';
import { resolve } from 'path';

export default withContentlayer({
    compress: true,
    reactStrictMode: false,
    cacheHandler: resolve('./src/lib/cache.js'),
    cacheMaxMemorySize: 0,
    experimental: {
        mdxRs: true,
        turbo: {
            rules: {
                // The following rule is required for loading .sass files. It is not
                // possible to remove this and still have Next.js load .sass files,
                // because when `sassOptions` is specified in next.config.js, Next.js
                // will not automatically configure sass-loader. (See
                //
                // https://nextjs.org/docs/api-reference/next.config.js/sass-options
                //
                // for more information.)
                '*.sass': {
                    loaders: ['sass-loader'],
                    options: {
                        implementation: import('sass')
                    }
                }
            },
            resolveImports: true
        },
        optimizeCss: true,
        optimizeServerReact: true,
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
    sassOptions: {
        silenceDeprecations: ['legacy-js-api'],
        silenceDeprecationWarnings: true,
        silenceWarnings: true,
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
        key: 'X-Content-Type-Options',
        value: 'nosniff'
    },
    {
        key: 'X-Frame-Options',
        value: 'DENY'
    },
    {
        key: 'X-XSS-Protection',
        value: '1; mode=block'
    },
    {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload'
    },
    {
        key: 'Referrer-Policy',
        value: 'origin-when-cross-origin'
    },
]
