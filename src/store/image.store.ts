import { atom } from "nanostores";

export const $currentImageIndex = atom<number>(0);

export const $loadedImagesSrcs = atom<string[]>([]);

export const $slideChange = atom<{
  activeIndex: number;
  previousIndex: number;
}>({
  activeIndex: -1,
  previousIndex: -1,
});
