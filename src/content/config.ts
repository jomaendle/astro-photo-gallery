import { defineCollection, z } from "astro:content";

const imageCollection = defineCollection({
  schema: ({ image }) =>
    z.object({
      color: z.string(),
      image: image(),
    }),
});

export const collections = {
  images: imageCollection,
};
