import { ReactNode } from "react";
import { SidebarList, SidebarProvider } from "@/components/UI/Sidebar/DocsSidebar";
import { getPageTree } from "@/hooks/pageTree/usePageTree";
import clsx from "clsx";

export type Param = {
    slug?: string[];
};

export default function DocsLayout({ children }: { children: ReactNode }) {
    const tree = getPageTree();

    return (
        <>
            <SidebarProvider>
                <div
                    className={clsx(
                        "grid grid-cols-1 gap-12 mx-auto w-full max-w-wider min-h-screen px-8 py-16 bg-dark",
                        "lg:grid-cols-[250px_auto] xl:grid-cols-[300px_auto_150px] 2xl:grid-cols-[300px_auto_300px] py-16 bg-dark",
                        "sm:px-14 xl:px-24 py-16 bg-dark"
                    )}
                >
                    <SidebarList items={tree} />
                    {children}
                </div>
            </SidebarProvider>
        </>
    );
}