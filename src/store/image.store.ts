import { atom, computed } from "nanostores";

export const $currentImageIndex = atom<number>(0);

export const $loadHighQualityImageByIndex = atom<number | null>(null);
