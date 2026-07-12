import type { Metadata } from "next"
import { NodesClient } from "@/packages/ui/components/Layouts/Nodes/nodes-client"
import { fetchStatusSnapshot, getNodeMonitorNames } from "@/packages/core/lib/status"

export const metadata: Metadata = {
  title: "Our Network & Nodes",
  description:
    "Live status and information about NodeByte Hosting's network. See where our infrastructure is located and what powers our game server and VPS hosting.",
}

export default async function NodesPage() {
  const snapshot = await fetchStatusSnapshot()
  const nodeNames = getNodeMonitorNames(snapshot)
  return <NodesClient nodeNames={nodeNames} />
}
