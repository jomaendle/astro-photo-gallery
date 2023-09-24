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
            quality: 75,
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

  const slides: React.JSX.Element[] = images.map(
    (image: GetImageResult, index: number) => {
      return (
        <SwiperSlide key={image.src} className={"p-4 h-full overflow-hidden"}>
          <img
            id="high-quality-image"
            src={image.src}
            alt="plant"
            className="z-10 object-contain transition-opacity h-full flex-1 overflow-hidden relative object-top"
            {...image.attributes}
            loading={index === 0 ? "eager" : "lazy"}
          />
        </SwiperSlide>
      );
    }
  );

  return (
    <Swiper
      className={"w-full h-full"}
      slidesPerView={1}
      spaceBetween={16}
      initialSlide={0}
      onSwiper={onSlideChange}
      onSlideChange={onSlideChange}
      cssMode={true}
      edgeSwipeDetection={"prevent"}
    >
      {slides}
    </Swiper>
  );
}
