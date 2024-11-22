/** @type {import('next').NextConfig} */

const nextConfig = {
    reactStrictMode: true,
    env: {
        API_URL: "https://billing.nodebyte.host/includes/api.php",
        API_SHORT_URL: "billing.nodebyte.host",
        API_IDENTIFIER: "gp1q8Fvvc6uDTrivyvypAGYXR6SQiGD6",
        API_SECRET: "kStD1AOfTLxSMFXmo4TfhXjMQRePMJsi",
        NEXTAUTH_SECRET: "fojr0h9858h95huhierhufiohnf9045y9",
        HETRIX_API_KEY: "bb00a3bfe18b17195c590f1e389576a2",
        GITHUB_API_URL: "https://raw.githubusercontent.com/"
    },
    sassOptions: {
        logger: {
            warn: (message, options) => {
                if (message.includes('DEPRECATION WARNING')) return;
                console.warn(message, options);
            }
        }
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
    }
]


module.exports = nextConfig
