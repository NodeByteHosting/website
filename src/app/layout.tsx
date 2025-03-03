import "styling/globals.scss";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

/** COMPONENTS */
import { Header } from "components/Header";
import { Footer } from "components/Footer";
import { BtnTop } from "components/BtnTop";
import { Loader } from "components/Loader";

/** PROVIDERS */
import ModalProvider from "providers/Modal";
import NextUiProvider from "providers/NextUi";

import { absoluteUrl } from "hooks/absoluteUrl";
import { GeistSans } from "geist/font/sans";
import DevTools from "@/src/providers/DevTools";

export const metadata: Metadata = {
  title: {
    template: '%s | NodeByte Hosting',
    default: 'NodeByte Hosting'
  },
  description: 'Fast, reliable, scalable and secure hosting services for your business or gaming experience.',
  openGraph: {
    url: "https://nodebyte.host",
    title: {
      template: '%s | NodeByte Hosting',
      default: 'NodeByte Hosting'
    },
    description: 'Fast, reliable, scalable and secure hosting services for your business or gaming experience.',
    images: "/banner.png",
    siteName: "NodeByte Hosting",
  },
  twitter: {
    card: 'summary_large_image',
    creator: "@TheRealToxicDev",
    title: {
      template: '%s | NodeByte Hosting',
      default: 'NodeByte Hosting'
    },
    description: 'Fast, reliable, scalable and secure hosting services for your business or gaming experience.',
    images: "/banner.png",
  },
  metadataBase: absoluteUrl()
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="">
      <body className="bg-gradient-to-br from-grey-900 via-dark_gray to-black border-gray-200" suppressHydrationWarning suppressContentEditableWarning>
        <div id="app" style={GeistSans.style}>
          <NextUiProvider>
            <ModalProvider>
              <Header />
              <main>{children}</main>
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "#0A2540",
                    color: "#fff",
                  }
                }}
              />
              <Footer />
              <BtnTop />
            </ModalProvider>
          </NextUiProvider>
          <Loader />
        </div>
      </body>
    </html>
  );
}