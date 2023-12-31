import { $currentImageIndex } from "../store/image.store.ts";
import type Swiper from "swiper";
import type { ImageWithMeta } from "../components/ImageSlides.tsx";

const IMAGE_URL_PARAM = "image";

export function writeActiveImageIdToUrl(id: string) {
  const url = new URL(window.location.href);
  url.searchParams.set(IMAGE_URL_PARAM, id);
  window.history.pushState({}, "", url.toString());
}

export function navigateToImage(swiper: Swiper, images: ImageWithMeta[]): void {
  const urlParams = new URLSearchParams(window.location.search);
  const imageId = urlParams.get(IMAGE_URL_PARAM);

  if (!imageId) {
    return;
  }

  const imageIndex = images.findIndex((image) => image.id === imageId);

  if (imageIndex < 0) {
    return;
  }

  $currentImageIndex.set(imageIndex);
  swiper.slideTo(imageIndex, 0, false);
}
