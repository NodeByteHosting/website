/** @type {import('next').NextConfig} */
import { createContentlayerPlugin } from 'next-contentlayer2';
import { resolve } from 'path';

export const withContentLayer = createContentlayerPlugin({
    configPath: './configs/contentlayer.ts',
    options: { cacheDir: '.contentlayer_cache' }
})

export default withContentLayer({
    compress: true,
    reactStrictMode: false,
    cacheHandler: resolve('./src/lib/cacheHandler.js'),
    cacheMaxMemorySize: 0,
    generateBuildId: async () => {
        return process.env.GIT_HASH
    },
    experimental: {
        mdxRs: true,
        turbo: {
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
        TAWK_TO_EMBED_URL: process.env.TAWK_TO_EMBED_URL
    },
})