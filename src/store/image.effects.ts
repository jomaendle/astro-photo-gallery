import { $currentImageIndex } from "./image.store.ts";
import { getCollection } from "astro:content";

const allImages = await getCollection("images");

$currentImageIndex.subscribe(async (index) => {
  const image = allImages[index];

  document.documentElement.style.setProperty(
    "--backgroundColor",
    image.data.color
  );
});
