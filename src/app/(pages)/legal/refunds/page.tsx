import { RefundPolicyLayout } from "./layouts/Refunds";
import { Metadata } from "next";

const meta = {
  title: 'Refund Policy',
  description: 'The stuff no one wants to read but everyone should know.',
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description
}

export default function RefundPolicy() {
  return <RefundPolicyLayout />
}
