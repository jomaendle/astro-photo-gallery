import {
  $currentImageIndex,
  $loadHighQualityImageByIndex,
} from "../store/image.store.ts";
import {
  addClassesToElement,
  getElementById,
  removeClassesFromElement,
} from "../util/dom.util.ts";
import { isMobile } from "../util/media-query.util.ts";

const NEXT_IMAGE_BUTTON: HTMLButtonElement =
  getElementById<HTMLButtonElement>("nextImageButton");

export const FOREGROUND_IMAGE: HTMLImageElement =
  getElementById<HTMLImageElement>("high-quality-image");

export const BACKGROUND_IMAGE: HTMLImageElement =
  getElementById<HTMLImageElement>("bg-image");

if (!FOREGROUND_IMAGE || !BACKGROUND_IMAGE) {
  throw new Error("Image not found");
}

/**
 * Event Listeners
 */
NEXT_IMAGE_BUTTON.addEventListener("click", async () => {
  $currentImageIndex.set($currentImageIndex.get() + 1);
});

FOREGROUND_IMAGE.addEventListener("load", () => {
  addClassesToElement(FOREGROUND_IMAGE, [
    "transition-opacity",
    "duration-500",
    "opacity-0",
  ]);

  removeClassesFromElement(FOREGROUND_IMAGE, ["opacity-0"]);

  if (!isMobile()) {
    $loadHighQualityImageByIndex.set($currentImageIndex.get());
  }
});
