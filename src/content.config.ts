import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const imageCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/images" }),
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      color: z.string(),
      image: image(),
      location: z.string(),
    }),
});

export const collections = {
  images: imageCollection,
};
