import type { GamePlanSpec } from "@/packages/core/types/servers/game"
import type { VpsPlanSpec } from "@/packages/core/types/servers/vps"
import { getOverride } from "./override-store"

/**
 * Returns game plans with admin overrides applied.
 * Plans with enabled=false are filtered out entirely (category shows OOS when all removed).
 * Plans with stock overridden show their OOS badge on the pricing card.
 */
export function applyGamePlanOverrides(
  category: string,
  plans: GamePlanSpec[],
): GamePlanSpec[] {
  return plans
    .filter((plan) => {
      const ov = getOverride(`${category}-${plan.id}`)
      return ov ? ov.enabled : true
    })
    .map((plan) => {
      const ov = getOverride(`${category}-${plan.id}`)
      return ov ? { ...plan, stock: ov.stock } : plan
    })
}

/**
 * Returns VPS plans with admin overrides applied.
 * Plans with enabled=false are filtered out entirely.
 */
export function applyVpsPlanOverrides(
  category: string,
  plans: VpsPlanSpec[],
): VpsPlanSpec[] {
  return plans
    .filter((plan) => {
      const ov = getOverride(`${category}-${plan.id}`)
      return ov ? ov.enabled : true
    })
    .map((plan) => {
      const ov = getOverride(`${category}-${plan.id}`)
      return ov ? { ...plan, stock: ov.stock } : plan
    })
}
