import { CookiePolicy } from "./layouts/CookiePolicy";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "The stuff no one wants to read but everyone should know.",
}
export default function TOS() {
  return <CookiePolicy />
}
