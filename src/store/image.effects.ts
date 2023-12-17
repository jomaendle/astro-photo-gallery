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
import { showToast, TOAST_CONTENT, TOAST_WRAPPER_ID } from "../util/toast.ts";

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

  showToast(event.toastMessage);
});
