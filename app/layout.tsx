import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getLocale } from "next-intl/server"
import "./globals.css"
import { Toaster } from "@/packages/ui/components/ui/toaster"
import { ThemeProvider } from "@/packages/ui/components/theme-provider"
import { CurrencyProvider } from "@/packages/core/hooks/use-currency"
import { LocaleProvider } from "@/packages/core/hooks/use-locale"
import { LayoutChrome } from "@/packages/ui/components/layout-chrome"
import { AuthProvider } from "@/packages/auth/components"
import { startScheduler } from "@/packages/core/lib/scheduler"

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
  description: "Fast, reliable, scalable and secure hosting services for your gaming experience. Launch dedicated and managed game servers with instant setup, DDoS protection and low latency networking.",
  metadataBase: new URL("https://nodebyte.host"),
  keywords: ["game server hosting", "minecraft hosting", "rust server hosting", "hytale hosting", "ark server hosting", "dedicated servers", "vps hosting", "ddos protection", "low latency gaming", "cloud servers"],
  applicationName: "NodeByte Hosting",
  openGraph: {
    siteName: "NodeByte Hosting",
    description: "Fast, reliable, scalable and secure hosting services for your gaming experience. Launch dedicated and managed game servers with instant setup, DDoS protection and low latency networking.",
    images: ["/og.png"],
    creators: ["@CodeMeAPixel"],
    locale: "en-US",
    url: "https://nodebyte.host",
  },
  twitter: {
    title: "NodeByte Hosting",
    description: "Fast, reliable, scalable and secure hosting services for your gaming experience. Launch dedicated and managed game servers with instant setup, DDoS protection and low latency networking.",
    images: ["/og.png"],
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
  // Ensure background scheduler is started (idempotent)
  try {
    // don't await to avoid delaying SSR
    startScheduler()
  } catch (e) {
    console.error("Failed to start scheduler:", e)
  }
  // Read theme preference from cookie on the server so SSR can render the correct class
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get("theme")?.value
  const knownThemes = ["light", "dark", "midnight", "rose", "forest", "desert", "ocean"]
  const themeClass = themeCookie && knownThemes.includes(themeCookie) ? themeCookie : undefined

  // Get locale and messages for next-intl
  const locale = await getLocale()
  const messages = await getMessages()

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
      </head>
      <body className={`font-sans antialiased notranslate`}>
        <AuthProvider>
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <CurrencyProvider>
                <LocaleProvider initialLocale={locale as any}>
                  <LayoutChrome>
                    {children}
                  </LayoutChrome>
                </LocaleProvider>
              </CurrencyProvider>
            </ThemeProvider>
          </NextIntlClientProvider>
        </AuthProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}