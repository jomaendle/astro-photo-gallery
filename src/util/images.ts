import { getElementsByClassName } from "./dom.util.ts";

export function getCurrentImageElement(
  index: number
): HTMLImageElement | undefined {
  const images = getAllImageElements();
  return images[index] as HTMLImageElement;
}

export function getAllImageElements(): HTMLImageElement[] {
  return getElementsByClassName("high-quality-image") as HTMLImageElement[];
}
