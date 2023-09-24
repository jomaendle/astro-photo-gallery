import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";

import { getCollection } from "astro:content";
import React, { useEffect, useState } from "react";
import { getImageWidthBasedOnDeviceWidth } from "../util/media-query.util.ts";
import { $currentImageIndex } from "../store/image.store.ts";

export default function SwiperWrapper() {
  const [images, setImages] = useState<GetImageResult[]>([]);

  useEffect(() => {
    const preferredImageWidth = getImageWidthBasedOnDeviceWidth();
    const loadImages = async () => {
      const imageCollection = await getCollection("images");
      const optimizedImages: GetImageResult[] = await Promise.all(
        imageCollection.map(async (image) => {
          return await getImage({
            src: image.data.image,
            width: preferredImageWidth,
          });
        })
      );

      return optimizedImages;
    };

    loadImages().then((images) => {
      setImages(images);
    });
  }, []);

  function onSlideChange(swiper: SwiperClass) {
    $currentImageIndex.set(swiper.activeIndex);
  }

  const slides: React.JSX.Element[] = images.map((image: GetImageResult) => {
    return (
      <SwiperSlide key={image.src} className={"p-4"}>
        <img
          id="bg-image"
          src={image.src}
          alt="plant"
          loading="lazy"
          className="absolute inset-0 blur-3xl z-0"
          {...image.attributes}
        />
        <img
          id="high-quality-image"
          src={image.src}
          alt="plant"
          loading="lazy"
          className="z-10 object-contain transition-opacity flex-1 overflow-hidden relative"
          {...image.attributes}
        />
      </SwiperSlide>
    );
  });

  return (
    <Swiper
      className={"h-full w-full"}
      slidesPerView={1}
      spaceBetween={16}
      initialSlide={0}
      onSwiper={onSlideChange}
      onSlideChange={onSlideChange}
    >
      {slides}
    </Swiper>
  );
}
