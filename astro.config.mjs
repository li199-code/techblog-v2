import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import { satteri } from "@astrojs/markdown-satteri";
import sitemap from "@astrojs/sitemap";
import pagefind from "astro-pagefind";
import satteriImageCaption from "./src/plugins/satteri-image-caption.mjs";

// https://astro.build/config
export default defineConfig({
  site: "https://jasonleehere.com",
  integrations: [sitemap(), mdx(), pagefind()],
  markdown: {
    processor: satteri({ hastPlugins: [satteriImageCaption] }),
    shikiConfig: {
      theme: "css-variables",
    },
  },
});
