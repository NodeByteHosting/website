import type React from "react"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "NodeByte Hosting",
  description: "Fast, reliable, scalable and secure hosting services for your gaming experience. Launch dedicated and managed game servers (Minecraft, Rust) with instant setup, DDoS protection and global low-latency networking."
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Read theme preference from cookie on the server so SSR can render the correct class
  const cookieStore = await cookies()
  const themeCookie = cookieStore.get("theme")?.value
  const knownThemes = ["light", "dark", "midnight", "rose", "forest", "desert", "ocean"]
  const themeClass = themeCookie && knownThemes.includes(themeCookie) ? themeCookie : undefined

  const htmlClass = [geist.variable, geistMono.variable, themeClass].filter(Boolean).join(" ")

  // If we know the theme server-side, set color-scheme so SSR HTML matches client
  const darkThemes = ["light", "dark", "midnight", "forest", "rose", "desert", "ocean"]
  const colorScheme = themeClass ? (darkThemes.includes(themeClass) ? 'dark' : 'light') : undefined

  return (
    <html lang="en" className={htmlClass} style={colorScheme ? { colorScheme } : undefined}>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}