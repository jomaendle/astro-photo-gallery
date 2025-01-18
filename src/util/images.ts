import type { ImageWithMeta } from "@/components/ImageCarousel.tsx";
import { getImage } from "astro:assets";
import { type CollectionEntry, getCollection } from "astro:content";

export async function loadImages(): Promise<ImageWithMeta[]> {
  const imageCollection = await getCollection("images");
  return await Promise.all(
    imageCollection.map(async (image: CollectionEntry<"images">) => {
      const imageResult = await getImage({
        src: image.data.image,
        width: 1800,
        quality: 89,
        format: "webp",
      });

      return {
        ...imageResult,
        color: image.data.color,
        location: image.data.location,
        id: image.data.id,
      };
    })
  );
}
