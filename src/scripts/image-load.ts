import {
  addClassesToElement,
  getElementById,
  getElementsByClassName,
  removeClassesFromElement,
} from "../util/dom.util.ts";
import { IMAGE_ID } from "../util/constants.ts";

window.addEventListener("load", () => {
  // check for the dom elements until they are loaded
  let interval = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(interval);
      console.log("DOM loaded. Image load script loaded.");

      init();
    }
  }, 50);
});

function init() {
  const FOREGROUND_IMAGES: HTMLImageElement[] =
    getElementsByClassName<HTMLImageElement>(IMAGE_ID);

  if (!FOREGROUND_IMAGES.length) {
    throw new Error("Image not found");
  }

  /**
   * Event Listeners
   */
  FOREGROUND_IMAGES.forEach((image: HTMLImageElement) => {
    image.addEventListener("load", () => {
      addClassesToElement(image, [
        "transition-opacity",
        "duration-500",
        "opacity-0",
      ]);

      removeClassesFromElement(image, ["opacity-0"]);
    });
  });
}
