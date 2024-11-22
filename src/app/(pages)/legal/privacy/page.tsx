import { PrivacyPolicy } from "./layouts/Privacy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "The stuff no one wants to read but everyone should know.",
}

export default function TOS() {
  return <PrivacyPolicy />
}
