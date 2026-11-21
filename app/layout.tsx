import "./global.css";
import { RootProvider } from "fumadocs-ui/provider/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { CurrencyProvider } from "@/components/currency";
import { KbSearch } from "@/components/kb-search";
import { SITE_URL } from "@/lib/site";

const DESCRIPTION =
  "Game servers, FiveM and RedM VPS, Linux VPS and object storage from NodeByte. DDoS protection, daily backups and UK support on every plan.";

export const metadata: Metadata = {
  description: DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    description: DESCRIPTION,
    siteName: "NodeByte Hosting",
    type: "website",
  },
  title: {
    default: "NodeByte Hosting: game servers and VPS",
    template: "%s | NodeByte Hosting",
  },
  twitter: { card: "summary_large_image", site: "@NodeByteHosting" },
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <html
    className={`${GeistSans.variable} ${GeistMono.variable}`}
    lang="en"
    suppressHydrationWarning
  >
    <body className="flex min-h-screen flex-col antialiased">
      <RootProvider
        search={{ SearchDialog: KbSearch }}
        theme={{
          defaultTheme: "dark",
          enableSystem: false,
          hotKey: false,
          storageKey: "nb-theme",
        }}
      >
        <CurrencyProvider>{children}</CurrencyProvider>
      </RootProvider>
    </body>
  </html>
);

export default RootLayout;
