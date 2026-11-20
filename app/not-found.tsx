import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { buttonStyles } from "@/lib/ui";

const NotFound = () => (
  <>
    <SiteHeader />
    <main className="container-page flex flex-1 flex-col items-center justify-center gap-5 py-32 text-center">
      <span className="text-link font-mono text-sm">404</span>
      <h1 className="text-4xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground max-w-md">
        This page doesn&apos;t exist or has moved. Try the homepage or the
        knowledge base.
      </p>
      <div className="flex gap-3">
        <Link className={buttonStyles.primary} href="/">
          Go home
        </Link>
        <Link className={buttonStyles.outline} href="/kb">
          Knowledge base
        </Link>
      </div>
    </main>
    <SiteFooter />
  </>
);

export default NotFound;
