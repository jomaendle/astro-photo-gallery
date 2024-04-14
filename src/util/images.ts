import { type CollectionEntry, getCollection } from "astro:content";
import { getImage } from "astro:assets";
import type { ImageWithMeta } from "@/components/ImageCarousel.tsx";

export async function loadImages(
  preferredImageWidth: number,
  quality?: number
): Promise<ImageWithMeta[]> {
  const imageCollection = await getCollection("images");
  return await Promise.all(
    imageCollection.map(async (image: CollectionEntry<"images">) => {
      const imageResult = await getImage({
        src: image.data.image,
        width: preferredImageWidth,
        quality,
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
