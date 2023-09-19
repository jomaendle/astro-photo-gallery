import { getImage } from "astro:assets";
import { getCollection } from "astro:content";

/**
 * Variables
 */
const allImages = await getCollection("images");

const currentImage = allImages[0].data;

const image: HTMLImageElement | null = document.getElementById(
  "high-quality-image"
) as HTMLImageElement;

let hasLoadedHighQualityImage = false;

if (!image) {
  throw new Error("Image not found");
}

image.addEventListener("load", () => {
  image.classList.add("transition-opacity");
  image.classList.add("duration-500");
  image.classList.add("opacity-100");

  setTimeout(onImageLoad, 2000);
});

async function onImageLoad() {
  const highQualityImage = await getImage({
    src: currentImage.image,
    width: 1600,
    quality: "high",
  });

  if (!image || hasLoadedHighQualityImage) {
    return;
  }

  if (image.src === highQualityImage.src) {
    return;
  }

  image.src = highQualityImage.src;
  image.classList.add("opacity-0");
  image.classList.remove("opacity-100");
  hasLoadedHighQualityImage = true;
}
