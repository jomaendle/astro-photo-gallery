import { getElementsByClassName } from "./dom.util.ts";
import { IMAGE_ID, NEXT_BUTTON_ID, PREV_BUTTON_ID } from "./constants.ts";
import type Swiper from "swiper";

export function getCurrentImageElement(
  index: number
): HTMLImageElement | undefined {
  const images = getAllImageElements();
  return images[index] as HTMLImageElement;
}

export function getAllImageElements(): HTMLImageElement[] {
  return getElementsByClassName(IMAGE_ID) as HTMLImageElement[];
}

export function onImageChange(
  direction: "next" | "prev",
  swiper: Swiper | null
) {
  const element = document.getElementById(
    direction === "next" ? NEXT_BUTTON_ID : PREV_BUTTON_ID
  );
  const icon = element?.children.item(0);
  const textClass = "text-gray-500";
  icon?.classList.add(textClass);

  setTimeout(() => {
    icon?.classList.remove(textClass);
  }, 350);

  element?.focus();

  if (!swiper) return;

  if (direction === "next") {
    swiper.slideNext();
  } else {
    swiper.slidePrev();
  }
}
