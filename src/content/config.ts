import { defineCollection, z } from "astro:content";

const imageCollection = defineCollection({
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
