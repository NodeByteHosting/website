/** @type {import('next').NextConfig} */
const { withContentlayer } = require('next-contentlayer2');
const withAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
    compress: true,
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
    pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
    experimental: {
        mdxRs: true,
        turbo: {
            resolveExtensions: [
                '.mdx',
                '.tsx',
                '.ts',
                '.jsx',
                '.js',
                '.mjs',
                '.json',
            ],
        },
    },
    images: {
        unoptimized: true,
        formats: ['image/avif', 'image/webp'],
        dangerouslyAllowSVG: true,
        remotePatterns: [
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
        API_URL: "https://billing.nodebyte.host/includes/api.php",
        API_SHORT_URL: "billing.nodebyte.host",
        API_IDENTIFIER: "gp1q8Fvvc6uDTrivyvypAGYXR6SQiGD6",
        API_SECRET: "kStD1AOfTLxSMFXmo4TfhXjMQRePMJsi",
        NEXTAUTH_SECRET: "fojr0h9858h95huhierhufiohnf9045y9",
        HETRIX_API_KEY: "bb00a3bfe18b17195c590f1e389576a2",
        GITHUB_API_URL: "https://api.github.com/repos",
        GITHUB_PAT: "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",
        ERROR_HOOK_ID: "1309739781889982485",
        ERROR_HOOK_TOKEN: "9zf3M23jmLDeGsmY6Ks_gvBfamMQUJKoLAYpziCDUypO8MSJ1FAl4nTZk4-YEWeMZ3JV",
    },
    sassOptions: {
        silenceDeprecations: ['legacy-js-api']
    },

    async headers() {
        return [
            {
                source: '/:path',
                headers: securityHeaders
            }
        ]
    }
}

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
    {
        key: "Cache-Control",
        value: "public, max-age=31536000, immutable"
    }
]


module.exports = withAnalyzer(withContentlayer(nextConfig));
