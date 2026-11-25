// The specification text lives in ../docs (docs/en is normative, docs/zh follows it); the site reads it from there.
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

export const collections = {
  docs: defineCollection({
    loader: glob({ base: new URL("../../docs/", import.meta.url), pattern: "{en,zh}/**/*.md" }),
    schema: docsSchema(),
  }),
};
