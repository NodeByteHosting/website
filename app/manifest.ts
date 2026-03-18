import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NodeByte Hosting",
    short_name: "NodeByte",
    description: "Fast, reliable, and secure hosting for game servers and VPS. Instant deployment, enterprise DDoS protection, NVMe SSD storage, and 24/7 expert support.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en-US",
    categories: ["hosting", "gaming", "infrastructure"],
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    display_override: ["standalone", "window-controls-overlay", "minimal-ui"],
    prefer_related_applications: false,
    shortcuts: [
      {
        name: "Game Servers",
        url: "/games",
        description: "Browse game server hosting plans",
      },
      {
        name: "VPS Hosting",
        url: "/vps",
        description: "Browse VPS hosting plans",
      },
      {
        name: "Dashboard",
        url: "/dashboard",
        description: "Manage your servers",
      },
    ],
  }
}
