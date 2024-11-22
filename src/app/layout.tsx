import "./styles/globals.scss";
import type { Metadata } from "next";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { BtnTop } from "./components/BtnTop/BtnTop";
import { Toaster } from "react-hot-toast";
import { Loader } from "./components/Loader/Loader";
import ModalProvider from "@/src/providers/ModalProvider";
import NextUiProvider from "@/src/providers/NextUiProvider";
import NodeByteSession from "@/src/providers/SessionProvider";
import { GeistSans } from "geist/font/sans";

const meta = {
  title: 'NodeByte Hosting',
  description: 'Fast, reliable, scalable and secure hosting services for your business or gaming experience.',
  image: 'https://nodebyte.host/logo.png',
  banner: 'https://nodebyte.host/banner.png'
}

export const metadata: Metadata = {
  title: {
    default: meta.title,
    template: '%s | NodeByte Hosting',
  },
  description: meta.description,
  openGraph: {
    title: meta.title,
    description: meta.description,
    url: 'https://nodebyte.host',
    siteName: 'NodeByte Hosting',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    title: meta.title,
    description: meta.description,
    images: meta.banner,
    card: 'summary_large_image'
  },
  alternates: {
    canonical: 'https://nodebyte.host'
  }
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
          <NodeByteSession>
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
          </NodeByteSession>
        </div>
      </body>
    </html>
  );
}