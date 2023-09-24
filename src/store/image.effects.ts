import { $currentImageIndex } from "./image.store.ts";
import { getCollection } from "astro:content";
import { getImage } from "astro:assets";

const allImages = await getCollection("images");

$currentImageIndex.subscribe(async (index) => {
  const image = allImages[index];

  document.documentElement.style.setProperty(
    "--backgroundColor",
    image.data.color
  );

  const lowResImage = await getImage({
    src: image.data.image,
    width: 100,
    quality: 30,
  });

  document.documentElement.style.setProperty(
    "--backgroundImage",
    `url(${lowResImage.src})`
  );
});
