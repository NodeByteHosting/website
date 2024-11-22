import { TermsOfService } from "./layouts/Terms";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "The stuff no one wants to read but everyone should know.",
}

export default function TOS() {
  return <TermsOfService />
}
