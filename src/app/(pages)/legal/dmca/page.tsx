import { DMCAPolicy } from "./layouts/DMCAPolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DMCA Policy",
  description: "The stuff no one wants to read but everyone should know.",
}
export default function TOS() {
  return <DMCAPolicy />
}
