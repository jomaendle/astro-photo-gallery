import { atom } from "nanostores";

export interface ImageShareClickPayload {
  toastMessage: string;
}

export const $imageShareClick = atom<ImageShareClickPayload | null>(null);

export const $toastShowing = atom<boolean>(false);

export const $viewsPerImage = atom<Map<string, number | undefined>>(new Map())

export function setViewsPerImageInStore(imageId: string, count: number | undefined) {
  $viewsPerImage.set(new Map($viewsPerImage.get()).set(imageId, count));
}
