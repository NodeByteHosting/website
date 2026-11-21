import "server-only";

export type OverallStatus = "operational" | "degraded" | "outage" | "unknown";

const INDICATORS: Record<string, OverallStatus> = {
  CRITICAL: "outage",
  MAJOR: "outage",
  MINOR: "degraded",
  NONE: "operational",
};

export const getOverallStatus = async (): Promise<OverallStatus> => {
  const host = process.env.STATUS_API_URL?.replace(/\/+$/u, "");
  if (!host) {
    return "unknown";
  }
  try {
    const res = await fetch(`${host}/api/status`, {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) {
      return "unknown";
    }
    const body = (await res.json()) as { status?: { indicator?: string } };
    return INDICATORS[body.status?.indicator ?? ""] ?? "unknown";
  } catch {
    return "unknown";
  }
};
