import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from "next-intl"
import { GoogleAdsPageView } from "@/packages/ui/components/google-ads-pageview"
import { GOOGLE_ADS_ID } from "@/packages/core/lib/gtag"
import { getMessages, getLocale } from "next-intl/server"
import "./globals.css"
import { Toaster } from "@/packages/ui/components/ui/toaster"
import { ThemeProvider } from "@/packages/ui/components/theme-provider"
import { CurrencyProvider } from "@/packages/core/hooks/use-currency"
import { LocaleProvider } from "@/packages/core/hooks/use-locale"
import { LayoutChrome } from "@/packages/ui/components/layout-chrome"
import { getCategoryHub } from "@/packages/core/lib/bytepay"
import { GAME_HUB_SLUGS } from "@/packages/core/constants/catalog-hubs"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: {
    default: "NodeByte Hosting",
    template: "%s | NodeByte Hosting",
  },
  description: "Fast, reliable, and secure hosting for game servers and VPS. Instant deployment, enterprise DDoS protection, NVMe SSD storage, and 24/7 expert support.",
  metadataBase: new URL("https://nodebyte.host"),
  keywords: ["game server hosting", "vps hosting", "minecraft hosting", "rust server hosting", "hytale hosting", "amd vps", "intel vps", "kvm vps", "dedicated servers", "ddos protection", "nvme ssd", "low latency gaming", "root access vps", "cloud servers", "nodebyte"],
  applicationName: "NodeByte Hosting",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    siteName: "NodeByte Hosting",
    description: "Fast, reliable, and secure hosting for game servers and VPS. Instant deployment, enterprise DDoS protection, NVMe SSD storage, and 24/7 expert support.",
    creators: ["@CodeMeAPixel"],
    locale: "en-US",
    url: "https://nodebyte.host",
  },
  twitter: {
    title: "NodeByte Hosting",
    description: "Fast, reliable, and secure hosting for game servers and VPS. Instant deployment, enterprise DDoS protection, NVMe SSD storage, and 24/7 expert support.",
    creator: "@CodeMeAPixel",
    card: "summary_large_image",
    site: "https://nodebyte.host",
  },
  appleWebApp: {
    statusBarStyle: "black-translucent",
    title: "NodeByte Hosting",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-video-preview": -1,
    }
  },
  other: {
    "mobile-web-app-capable": "yes",
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Read theme preference from cookie on the server so SSR can render the correct class
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get("theme")?.value
  const knownThemes = ["light", "dark", "midnight", "rose", "forest", "desert", "ocean", "slate", "crimson", "emerald", "amber", "teal", "lavender", "violet", "stranger", "christmas", "newyear", "catppuccin-mocha", "catppuccin-macchiato", "catppuccin-frappe", "catppuccin-latte", "dracula", "nord", "gruvbox", "solarized", "tokyo-night", "one-dark", "rose-pine"]
  const themeClass = themeCookie && knownThemes.includes(themeCookie) ? themeCookie : undefined

  // Get locale and messages for next-intl
  const locale = await getLocale()
  const messages = await getMessages()

  // Never let a billing-panel outage take down every page on the site — the
  // nav just falls back to no games submenu entries if this fails.
  const gamesNav = await getCategoryHub(GAME_HUB_SLUGS)
    .then((hub) => (hub?.children ?? []).map((c) => ({ slug: c.slug, name: c.name })))
    .catch(() => [])

  const htmlClass = [geist.variable, geistMono.variable, themeClass].filter(Boolean).join(" ")

  return (
    <html 
      lang={locale} 
      className={htmlClass} 
      translate="no"
      suppressHydrationWarning 
      suppressContentEditableWarning
    >
      <head>
        {/* Prevent browser translation extensions from modifying the page */}
        <meta name="google" content="notranslate" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "NodeByte Hosting",
                url: "https://nodebyte.host",
                logo: "https://nodebyte.host/logo.png",
                description: "Fast, reliable, and secure hosting for game servers and VPS. Instant deployment, enterprise DDoS protection, NVMe SSD storage, and 24/7 expert support.",
                sameAs: ["https://twitter.com/CodeMeAPixel"],
                contactPoint: {
                  "@type": "ContactPoint",
                  contactType: "customer support",
                  url: "https://nodebyte.host/contact",
                  availableLanguage: "English",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "NodeByte Hosting",
                url: "https://nodebyte.host",
                potentialAction: {
                  "@type": "SearchAction",
                  target: {
                    "@type": "EntryPoint",
                    urlTemplate: "https://nodebyte.host/kb?q={search_term_string}",
                  },
                  "query-input": "required name=search_term_string",
                },
              },
            ]),
          }}
        />
      </head>
      <body className={`font-sans antialiased notranslate`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <CurrencyProvider>
              <LocaleProvider initialLocale={locale as any}>
                <LayoutChrome gamesNav={gamesNav}>
                  {children}
                </LayoutChrome>
              </LocaleProvider>
            </CurrencyProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Toaster />
        <Analytics />
        <GoogleAdsPageView />
        {/* Google Ads tag */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}