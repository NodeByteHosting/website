import type { MetadataRoute } from "next"

const BASE_URL = "https://nodebyte.host"

// Static routes with their priorities and change frequencies
const staticRoutes: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
}> = [
  { path: "",              priority: 1.0, changeFrequency: "weekly"  },
  { path: "/games",        priority: 0.9, changeFrequency: "weekly"  },
  { path: "/games/minecraft", priority: 0.9, changeFrequency: "weekly" },
  { path: "/games/rust",   priority: 0.9, changeFrequency: "weekly"  },
  { path: "/games/hytale", priority: 0.8, changeFrequency: "monthly" },
  { path: "/vps",          priority: 0.9, changeFrequency: "weekly"  },
  { path: "/vps/amd",      priority: 0.9, changeFrequency: "weekly"  },
  { path: "/vps/intel",    priority: 0.8, changeFrequency: "monthly" },
  { path: "/about",        priority: 0.6, changeFrequency: "monthly" },
  { path: "/partners",     priority: 0.5, changeFrequency: "monthly" },
  { path: "/contact",      priority: 0.7, changeFrequency: "monthly" },
  { path: "/changelog",    priority: 0.5, changeFrequency: "weekly"  },
  { path: "/kb",           priority: 0.7, changeFrequency: "weekly"  },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  return staticRoutes.map(({ path, priority, changeFrequency }) => ({
    url: `${BASE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))
}
