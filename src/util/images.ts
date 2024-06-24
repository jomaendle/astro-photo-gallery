import type { ImageWithMeta } from "@/components/ImageCarousel.tsx";
import { getImage } from "astro:assets";
import { getCollection, type CollectionEntry } from "astro:content";

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
        quality: quality ?? 80,
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
