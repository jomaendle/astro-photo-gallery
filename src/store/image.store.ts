import { atom } from "nanostores";

export interface ImageShareClickPayload {
  toastMessage: string;
}

export const $imageShareClick = atom<ImageShareClickPayload | null>(null);

export const $toastShowing = atom<boolean>(false);
