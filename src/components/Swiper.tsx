import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

import React, { useEffect, useState } from "react";
import { getImageWidthBasedOnDeviceWidth } from "../util/media-query.util.ts";
import { $currentImageIndex, $slideChange } from "../store/image.store.ts";
import ImageButtons from "./ImageButtons.tsx";
import ImageSlides, { type ImageWithMeta } from "./ImageSlides.tsx";
import { loadImages, onImageChange } from "../util/images.ts";
import { navigateToImage } from "../util/url.util.ts";
import { Pagination } from "swiper/modules";

export default function SwiperWrapper() {
  const [images, setImages] = useState<ImageWithMeta[]>([]);
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
    const preferredImageWidth = getImageWidthBasedOnDeviceWidth();

    loadImages(preferredImageWidth).then((images: ImageWithMeta[]) => {
      setImages(images);
    });
  }, []);

  useEffect(() => {
    if (swiper && images) {
      navigateToImage(swiper, images);
    }
  }, [images, swiper]);

  function onSlideChange(swiper: SwiperClass) {
    $currentImageIndex.set(swiper.activeIndex);

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
          virtualIndex={index}
        >
          <ImageSlides image={image} index={index} />
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
