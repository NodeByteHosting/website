// source.config.ts
import { defineConfig, defineDocs } from "fumadocs-mdx/config";
var kb = defineDocs({
  dir: "content/kb"
});
var source_config_default = defineConfig();
export {
  source_config_default as default,
  kb
};
