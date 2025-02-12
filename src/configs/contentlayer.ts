import { makeSource } from "contentlayer2/source-files";
import rehypePrettycode from "rehype-pretty-code";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

import { Blog, BlogMeta } from "@/src/constants/blogContent";
import { Docs, Meta } from "@/src/constants/docsContent";

export default makeSource({
    contentDirPath: "src/content",
    documentTypes: [Docs, Meta, Blog, BlogMeta],
    mdx: {
        rehypePlugins: [
            rehypePrettycode,
            rehypeSlug
        ],
        remarkPlugins: [
            remarkGfm
        ],
    }
});