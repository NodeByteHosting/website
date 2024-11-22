import { CookiePolicy } from "./layouts/CookiePolicy";
import { Metadata } from "next";

const meta = {
  title: 'Cookie Policy',
  description: 'The stuff no one wants to read but everyone should know.'
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description
}

export default function TOS() {
  return <CookiePolicy />
}
