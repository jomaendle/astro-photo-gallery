import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import React, { useEffect, useState } from "react";
import { $currentImageIndex, $slideChange } from "../store/image.store.ts";
import ImageButtons from "./ImageButtons.tsx";
import ImageSlides, { type ImageWithMeta } from "./ImageSlides.tsx";
import { onImageChange } from "../util/images.ts";
import { navigateToImage, writeActiveImageIdToUrl } from "../util/url.util.ts";
import { Pagination } from "swiper/modules";
import { setBackgroundColorCssVariable } from "../util/dom.util.ts";

export default function SwiperWrapper({
  images,
  lowResImages,
}: {
  images: ImageWithMeta[];
  lowResImages: ImageWithMeta[];
}) {
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        onImageChange("next", swiper);
      }

      if (event.key === "ArrowLeft") {
        onImageChange("prev", swiper);
      }
    });
  }, [swiper]);

  useEffect(() => {
    if (swiper && images) {
      navigateToImage(swiper, images);

      const currentImage = images[swiper.activeIndex];
      setBackgroundColorCssVariable(currentImage.color);
    }
  }, [images, swiper]);

  function onSlideChange(swiper: SwiperClass) {
    $currentImageIndex.set(swiper.activeIndex);

    const currentImage = images[swiper.activeIndex];
    setBackgroundColorCssVariable(currentImage.color);
    writeActiveImageIdToUrl(currentImage.id ?? "");

    $slideChange.set({
      previousIndex: swiper.previousIndex,
      activeIndex: swiper.activeIndex,
    });
  }

  const slides: React.JSX.Element[] = images.map(
    (image: ImageWithMeta, index: number) => {
      return (
        <SwiperSlide
          key={image.src}
          className={"flex h-full justify-center overflow-hidden"}
        >
          <ImageSlides image={image} imagePreview={lowResImages[index]} />
        </SwiperSlide>
      );
    }
  );

  return (
    <div className={"h-full flex-col overflow-hidden md:flex"}>
      <Swiper
        className={"h-full w-full overflow-hidden"}
        slidesPerView={1}
        spaceBetween={32}
        initialSlide={0}
        onSlideChange={onSlideChange}
        onSwiper={setSwiper}
        cssMode={true}
        modules={[Pagination]}
        edgeSwipeDetection={"prevent"}
      >
        {slides}
      </Swiper>

      <ImageButtons
        onNextClick={() => onImageChange("next", swiper)}
        onPrevClick={() => onImageChange("prev", swiper)}
      />
    </div>
  );
}
