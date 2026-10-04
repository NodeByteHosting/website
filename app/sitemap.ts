import type { MetadataRoute } from "next"

const BASE_URL = "https://nodebyte.host"

const staticRoutes: Array<{
  path: string
  priority: number
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]
}> = [
  { path: "",              priority: 1.0, changeFrequency: "weekly"  },
  { path: "/games",        priority: 0.9, changeFrequency: "weekly"  },
  { path: "/vps",          priority: 0.9, changeFrequency: "weekly"  },
  { path: "/dedicated",    priority: 0.9, changeFrequency: "weekly"  },
  { path: "/object-storage", priority: 0.8, changeFrequency: "weekly"  },
  { path: "/discord-bots", priority: 0.8, changeFrequency: "weekly"  },
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
