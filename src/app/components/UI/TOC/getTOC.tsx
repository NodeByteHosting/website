"use client";

import { ActiveAnchorProvider, useActiveAnchor } from "./provider";
import { TableOfContents } from "@/hooks/getTOC";
import clsx from "clsx";
import { useMemo } from "react";
import type { Item } from "@/hooks/getTOC";

export function TOC({ toc }: { toc: TableOfContents }) {
    const headings = useMemo(() => {
        return toc
            .flatMap((item) => getHeadings(item))
            .map((item) => item.split("#")[1]);
    }, [toc]);

    return (
        <ActiveAnchorProvider headings={headings}>
            {toc.map((item, i) => (
                <Item key={i} item={item} />
            ))}
        </ActiveAnchorProvider>
    );
}

function getHeadings(item: Item): string[] {
    const children = item.items?.flatMap((item) => getHeadings(item)) ?? [];

    return [item.url, ...children];
}

function Item({ item }: { item: Item }) {
    const activeAnchor = useActiveAnchor();
    const active = activeAnchor[item.url.split("#")[1]]?.isActive === true;

    return (
        <div>
            <a
                href={item.url}
                className={clsx(
                    "text-sm",
                    active
                        ? "font-semibold text-white"
                        : "text-white"
                )}
            >
                {item.title}
            </a>
            <div className="flex flex-col pl-4 text-white">
                {item.items?.map((item, i) => (
                    <Item key={i} item={item} />
                ))}
            </div>
        </div>
    );
}