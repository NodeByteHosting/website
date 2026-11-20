import type { ReactNode } from "react";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const SiteLayout = ({ children }: { children: ReactNode }) => (
  <>
    <SiteHeader />
    <main className="flex flex-1 flex-col">{children}</main>
    <SiteFooter />
  </>
);

export default SiteLayout;
