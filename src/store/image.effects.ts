import {
  $currentImageIndex,
  $loadedImagesSrcs,
  $slideChange,
} from "./image.store.ts";
import { type CollectionEntry, getCollection } from "astro:content";
import {
  setImageFadeInStyle,
  setImageFadeOutStyle,
} from "../util/image-fade.util.ts";
import { getAllImageElements, getCurrentImageElement } from "../util/images.ts";
import { getImage } from "astro:assets";
import { getImageWidthBasedOnDeviceWidth } from "../util/media-query.util.ts";

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

  /*await _preloadImgs(index, image);*/
});

/**
 * Listens to the slide change event.
 * It fades in the current image and fades out the previous image.
 */
$slideChange.listen(({ activeIndex, previousIndex }) => {
  console.log("slideChange", activeIndex, previousIndex);

  if (activeIndex === previousIndex) {
    return;
  }

  const currentImage = getCurrentImageElement(activeIndex);

  if (currentImage?.complete) {
    setImageFadeInStyle(currentImage);
  }

  const images = getAllImageElements();
  const previousImage = images[previousIndex] as HTMLImageElement;

  setImageFadeOutStyle(previousImage);
});

async function _preloadImgs(index: number, image: CollectionEntry<"images">) {
  console.log(allImages);

  // prefetch the next 2 images in the background
  const nextImage = allImages[index + 1];
  if (nextImage) {
    const preferredImageWidth = getImageWidthBasedOnDeviceWidth();

    const nextImageElement = await getImage({
      src: image.data.image,
      width: preferredImageWidth,
      quality: 90,
    });

    if ($loadedImagesSrcs.get().includes(nextImage.data.image.src)) {
      console.log("Image already loaded");
      return;
    }

    const nextImg = new Image();
    nextImg.src = nextImageElement.src;
    nextImg.classList.add("opacity-0");

    document.body.appendChild(nextImg);

    nextImg.addEventListener("load", () => {
      console.log("nextImage", nextImage.data.image.src);
      $loadedImagesSrcs.set([
        ...$loadedImagesSrcs.get(),
        nextImage.data.image.src,
      ]);
    });
  }
}
