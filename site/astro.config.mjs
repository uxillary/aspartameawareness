import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import remarkSmartImage from "./tools/remark-smart-image.js";

export default defineConfig({
  site: "https://aspartameawareness.org",
  integrations: [tailwind(), mdx(), sitemap()],
  markdown: {
    remarkPlugins: [remarkSmartImage],
    rehypePlugins: []
  }
});
