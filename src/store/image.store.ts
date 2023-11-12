import { atom } from "nanostores";
import type { CollectionEntry } from "astro:content";

export const $currentImageIndex = atom<number>(0);

export const $slideChange = atom<{
  activeIndex: number;
  previousIndex: number;
}>({
  activeIndex: -1,
  previousIndex: -1,
});

export interface ImageShareClickPayload {
  image: CollectionEntry<"images">;
  toastMessage: string;
  icon: string;
}

export const $imageShareClick = atom<ImageShareClickPayload | null>(null);

export const $toastShowing = atom<boolean>(false);
