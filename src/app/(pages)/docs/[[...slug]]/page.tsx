import { allDocs } from "contentlayer/generated";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/UI/MDX/Content";
import { Param } from "../layout";
import type { Metadata } from "next";
import { getTableOfContents } from "@/hooks/getTOC";
import { TOC } from "@/components/UI/TOC/getTOC";
import { Breadcrumb } from "ui/Breadcrumb";
import { getPageTree } from "@/hooks/pageTree/usePageTree";
import { absoluteUrl } from "@/hooks/absoluteUrl";

export default async function Page({ params }: { params: Param }) {
    const path = (params.slug ?? []).join("/");
    const page = allDocs.find((page) => page.slug === path);

    if (page == null) {
        notFound();
    }

    const tree = getPageTree();
    const toc = await getTableOfContents(page.body.raw);

    return (
        <>
            <article className="flex flex-col gap-6 py-8 lg:py-16">
                <Breadcrumb tree={tree} />
                <h1 className="text-4xl font-bold text-white">{page.title}</h1>
                <div className="markdown-body">
                    <MdxContent code={page.body.code} />
                </div>
            </article>
            <div className="relative flex flex-col gap-3 max-xl:hidden py-16">
                <div className="sticky top-28 flex flex-col gap-3 overflow-auto max-h-[calc(100vh-4rem-3rem)]">
                    {toc.length > 0 && (
                        <h3 className="font-semibold text-white">On this page</h3>
                    )}
                    <TOC toc={toc} />
                </div>
            </div>
        </>
    );
}

export function generateMetadata({ params }: { params: Param }): Metadata {
    const path = (params.slug ?? []).join("/");
    const page = allDocs.find((page) => page.slug === path);

    if (page == null) return {};

    const description =
        page.description ?? 'Fast, reliable, scalable and secure hosting services for your business or gaming experience.';

    return {
        title: page.title,
        description: description,
        openGraph: {
            url: "https://nodebyte.host",
            title: page.title,
            description: description,
            images: "/banner.png",
            siteName: "NodeByte Hosting",
        },
        twitter: {
            card: "summary_large_image",
            creator: "@TheRealToxicDev",
            title: page.title,
            description: description,
            images: "/banner.png",
        },
        metadataBase: absoluteUrl(),
    };
}

export async function generateStaticParams(): Promise<Param[]> {
    return allDocs.map((docs) => ({
        slug: docs.slug.split("/"),
    }));
}