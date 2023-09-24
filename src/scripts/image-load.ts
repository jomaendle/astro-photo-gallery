import {
  addClassesToElement,
  getElementById,
  removeClassesFromElement,
} from "../util/dom.util.ts";

window.addEventListener("load", () => {
  // check for the dom elements until they are loaded
  let interval = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(interval);
      console.log("DOM loaded. Image load script loaded.");

      init();
    }
  }, 100);
});

function init() {
  const FOREGROUND_IMAGE: HTMLImageElement =
    getElementById<HTMLImageElement>("high-quality-image");

  const BACKGROUND_IMAGE: HTMLImageElement =
    getElementById<HTMLImageElement>("bg-image");

  if (!FOREGROUND_IMAGE || !BACKGROUND_IMAGE) {
    throw new Error("Image not found");
  }

  /**
   * Event Listeners
   */
  FOREGROUND_IMAGE.addEventListener("load", () => {
    addClassesToElement(FOREGROUND_IMAGE, [
      "transition-opacity",
      "duration-500",
      "opacity-0",
    ]);

    removeClassesFromElement(FOREGROUND_IMAGE, ["opacity-0"]);
  });
}
