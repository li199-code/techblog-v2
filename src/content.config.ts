import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const postSchema = z.object({
  title: z.string(),
  date: z.coerce.date(),
  lastUpdateDate: z.coerce.date().optional(),
  description: z.string().optional(),
  ogImage: z.string().optional(),
  draft: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

function postCollection(name: string) {
  return defineCollection({
    loader: glob({
      pattern: "**/*.{md,mdx}",
      base: `./src/content/${name}`,
    }),
    schema: postSchema,
  });
}

const blog = postCollection("blog");
const daily = postCollection("daily");
const projects = postCollection("projects");
const talks = postCollection("talks");
const FIRE = postCollection("FIRE");
const others = postCollection("others");

export const collections = { blog, daily, projects, talks, FIRE, others };
