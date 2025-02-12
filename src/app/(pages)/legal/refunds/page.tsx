import { RefundPolicyLayout } from "./layouts/Refunds";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "The stuff no one wants to read but everyone should know.",
}

export default function RefundPolicy() {
  return <RefundPolicyLayout />
}
