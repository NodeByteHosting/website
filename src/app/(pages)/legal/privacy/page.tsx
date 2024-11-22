import { PrivacyPolicy } from "./layouts/Privacy";
import { Metadata } from "next";

const meta = {
  title: 'Privacy Policy',
  description: 'The stuff no one wants to read but everyone should know.'
}

export const metadata: Metadata = {
  title: meta.title,
  description: meta.description
}

export default function TOS() {
  return <PrivacyPolicy />
}
