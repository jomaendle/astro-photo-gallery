import { $currentImageIndex, $slideChange } from "./image.store.ts";
import { type CollectionEntry, getCollection } from "astro:content";
import { getElementsByClassName } from "../util/dom.util.ts";
import {
  setImageFadeInStyle,
  setImageFadeOutStyle,
} from "../util/image-fade.util.ts";

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

  const images = getElementsByClassName("high-quality-image");
  const currentImage: HTMLImageElement | undefined = images[
    activeIndex
  ] as HTMLImageElement;

  if (currentImage?.complete) {
    setImageFadeInStyle(currentImage);
  }

  const previousImage = images[previousIndex] as HTMLImageElement;
  setImageFadeOutStyle(previousImage);
});
