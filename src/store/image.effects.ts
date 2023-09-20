import {
  $currentImageIndex,
  $loadHighQualityImageByIndex,
} from "./image.store.ts";
import { getImage } from "astro:assets";
import { BACKGROUND_IMAGE, FOREGROUND_IMAGE } from "../scripts/image-load.ts";
import { getCollection } from "astro:content";

const allImages = await getCollection("images");

$currentImageIndex.listen(async (index) => {
  const arrayIndex = index % allImages.length;
  const nextImage = allImages[arrayIndex];

  const image = await getImage({
    src: nextImage.data.image,
    width: 800,
    quality: "mid",
  });

  FOREGROUND_IMAGE.src = image.src;
  BACKGROUND_IMAGE.src = image.src;

  document.documentElement.style.setProperty(
    "--backgroundColor",
    nextImage.data.color
  );
});

$loadHighQualityImageByIndex.listen(async (index) => {
  if (index === null) {
    return;
  }

  const arrayIndex = index % allImages.length;
  const nextImage = allImages[arrayIndex];

  const hqImg = await getImage({
    src: nextImage.data.image,
    width: 1200,
    quality: "high",
  });

  console.log("new HQ image loaded", hqImg);

  FOREGROUND_IMAGE.src = hqImg.src;
  BACKGROUND_IMAGE.src = hqImg.src;
});
