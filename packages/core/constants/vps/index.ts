export * from "./amd"
export * from "./intel"

import { AMD_PLANS } from "./amd"
import { INTEL_PLANS } from "./intel"
import type { VpsPlanSpec } from "@/packages/core/types/servers/vps"

/** All plans across every hardware line — used by the /vps hub page */
export const ALL_VPS_PLANS: VpsPlanSpec[] = [
  ...AMD_PLANS,
  ...INTEL_PLANS,
]

/** Static option data for each VPS type — used by the /vps index page */
export const VPS_OPTIONS = [
  {
    slug:            "amd" as const,
    startingPriceGBP: 4.50,
    inStock:          true,
    gradient:         "from-red-500/20 via-orange-500/10 to-primary/5",
    iconBg:           "bg-red-500/10 text-red-500",
    tagColor:         "bg-primary text-primary-foreground",
  },
  {
    slug:            "intel" as const,
    startingPriceGBP: 4.50,
    inStock:          false,
    gradient:         "from-blue-500/20 via-cyan-500/10 to-accent/5",
    iconBg:           "bg-blue-500/10 text-blue-500",
    tagColor:         "bg-accent text-accent-foreground",
  },
] as const
