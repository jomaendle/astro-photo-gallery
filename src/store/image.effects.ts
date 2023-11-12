import {
  $currentImageIndex,
  $imageShareClick,
  $slideChange,
  $toastShowing,
} from "./image.store.ts";
import { type CollectionEntry, getCollection } from "astro:content";
import {
  setImageFadeInStyle,
  setImageFadeOutStyle,
} from "../util/image-fade.util.ts";
import { getAllImageElements, getCurrentImageElement } from "../util/images.ts";
import { writeActiveImageIdToUrl } from "../util/url.util.ts";
import { TOAST_CONTENT, TOAST_WRAPPER_ID } from "../util/toast.ts";

const allImages = await getCollection("images");

/**
 * Sets the background color and background image of the document.
 * It uses the current image index to get the image data.
 */
$currentImageIndex.subscribe(async (index) => {
  const image: CollectionEntry<"images"> = allImages[index];

  document.documentElement.style.setProperty(
    "--backgroundColor",
    image.data.color
  );
});

/**
 * Listens to the slide change event.
 * It fades in the current image and fades out the previous image.
 */
$slideChange.listen(({ activeIndex, previousIndex }) => {
  if (activeIndex === previousIndex) {
    return;
  }

  const currentImage = getCurrentImageElement(activeIndex);

  const image: CollectionEntry<"images"> = allImages[activeIndex];
  writeActiveImageIdToUrl(image.data.id ?? "");

  if (currentImage?.complete) {
    setImageFadeInStyle(currentImage);
  }

  const images = getAllImageElements();
  const previousImage = images[previousIndex] as HTMLImageElement;

  setImageFadeOutStyle(previousImage);
});

$imageShareClick.listen(async (event) => {
  if (!event || $toastShowing.get()) {
    return;
  }

  const url = new URL(window.location.href);
  await navigator.clipboard.writeText(url.href);

  const toastElement = document.querySelector(
    `#${TOAST_WRAPPER_ID}`
  ) as HTMLDivElement;

  const toastContent = document.getElementById(TOAST_CONTENT);

  if (!toastElement || !toastContent) {
    return;
  }

  $toastShowing.set(true);

  toastElement.style.visibility = "visible";
  toastContent.classList.add("translate-y-12");

  toastContent.innerHTML = `
    <svg class="text-green-900 bg-green-200 rounded-full p-1" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 16 16"><path fill="currentColor" d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06a.733.733 0 0 1 1.047 0l3.052 3.093l5.4-6.425a.247.247 0 0 1 .02-.022Z"/></svg>
    <span>${event.toastMessage}</span>
    `;

  setTimeout(() => {
    toastContent.classList.remove("translate-y-12");
    toastContent.classList.add("opacity-0");
  }, 3000);

  setTimeout(() => {
    toastElement.style.visibility = "hidden";
    toastContent.classList.remove("opacity-0");
    toastContent.innerHTML = "";
    $toastShowing.set(false);
  }, 3300);
});
