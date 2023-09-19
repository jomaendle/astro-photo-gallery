import { getImage } from "astro:assets";
import { getCollection } from "astro:content";

/**
 * Variables
 */
const allImages = await getCollection("images");
const currentImage = allImages[0].data;

let isImageLoading = true;

/**
 * DOM Elements
 */
const nextImageButton: HTMLButtonElement = document.getElementById(
  "nextImageButton"
) as HTMLButtonElement;

const image: HTMLImageElement = document.getElementById(
  "high-quality-image"
) as HTMLImageElement;

const bgImage: HTMLImageElement = document.getElementById(
  "bg-image"
) as HTMLImageElement;

let hasLoadedHighQualityImage = false;

if (!image) {
  throw new Error("Image not found");
}

/**
 * Event Listeners
 */
nextImageButton.addEventListener("click", async () => {
  if (isImageLoading) {
    console.log("Image is loading");
    return;
  }

  const nextImage = allImages[Math.floor(Math.random() * allImages.length)];

  const lqImg = await getImage({
    src: nextImage.data.image,
    width: 800,
    quality: "mid",
  });

  image.src = lqImg.src;
  bgImage.src = lqImg.src;

  document.documentElement.style.setProperty(
    "--backgroundColor",
    nextImage.data.color
  );
});

image.addEventListener("load", () => {
  image.classList.add("transition-opacity");
  image.classList.add("duration-500");
  image.classList.add("opacity-100");

  isImageLoading = false;

  setTimeout(onImageLoad, 2000);
});

/**
 * Functions
 */
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
  isImageLoading = true;
}
