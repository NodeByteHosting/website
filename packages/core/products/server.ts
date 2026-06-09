import type { GamePlanSpec } from "@/packages/core/types/servers/game"
import type { VpsPlanSpec } from "@/packages/core/types/servers/vps"
import { getOverride } from "./override-store"

/**
 * Returns game plans with admin overrides applied.
 * Plans with enabled=false are filtered out entirely (category shows OOS when all removed).
 * Plans with stock overridden show their OOS badge on the pricing card.
 */
function applyOverrides<T extends { id: string }>(
  category: string,
  plans: T[],
): T[] {
  const result: T[] = []
  for (const plan of plans) {
    const ov = getOverride(`${category}-${plan.id}`)
    if (ov && !ov.enabled) continue
    result.push(ov ? { ...plan, stock: ov.stock } as T : plan)
  }
  return result
}

export function applyGamePlanOverrides(
  category: string,
  plans: GamePlanSpec[],
): GamePlanSpec[] {
  return applyOverrides(category, plans)
}

export function applyVpsPlanOverrides(
  category: string,
  plans: VpsPlanSpec[],
): VpsPlanSpec[] {
  return applyOverrides(category, plans)
}
