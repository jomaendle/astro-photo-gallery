import { getImage } from "astro:assets";
import { getCollection } from "astro:content";

/**
 * Variables
 */
const allImages = await getCollection("images");
const currentImage = allImages[0].data;

let isImageLoading = false;

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
  console.log("Image loaded, ", "add opacity-100");
  image.classList.add("transition-opacity");
  image.classList.add("duration-500");
  image.classList.add("opacity-100");
  image.classList.remove("opacity-0");
});
