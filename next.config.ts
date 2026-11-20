import { createMDX } from "fumadocs-mdx/next";
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "cdn.cloudflare.steamstatic.com", protocol: "https" },
    ],
  },
  reactStrictMode: true,
};

export default createMDX()(config);
