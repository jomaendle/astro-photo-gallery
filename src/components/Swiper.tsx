import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";

import { type CollectionEntry, getCollection } from "astro:content";
import React, { type SyntheticEvent, useEffect, useState } from "react";
import { getImageWidthBasedOnDeviceWidth } from "../util/media-query.util.ts";
import { $currentImageIndex } from "../store/image.store.ts";

type ImageWithMeta = GetImageResult & {
  location: string;
};

export default function SwiperWrapper() {
  const [images, setImages] = useState<ImageWithMeta[]>([]);

  useEffect(() => {
    const preferredImageWidth = getImageWidthBasedOnDeviceWidth();
    const loadImages = async (): Promise<ImageWithMeta[]> => {
      const imageCollection = await getCollection("images");
      return await Promise.all(
        imageCollection.map(async (image: CollectionEntry<"images">) => {
          const imageResult = await getImage({
            src: image.data.image,
            width: preferredImageWidth,
            quality: 75,
          });

          return {
            ...imageResult,
            location: image.data.location,
          };
        })
      );
    };

    loadImages().then((images: ImageWithMeta[]) => {
      setImages(images);
    });
  }, []);

  function onSlideChange(swiper: SwiperClass) {
    $currentImageIndex.set(swiper.activeIndex);
  }

  function onImageLoaded(event: SyntheticEvent<HTMLImageElement, Event>): void {
    const image = event.target as HTMLImageElement;
    image.classList.add("opacity-100");
    image.classList.remove("opacity-0");
  }

  const slides: React.JSX.Element[] = images.map(
    (image: ImageWithMeta, index: number) => {
      return (
        <SwiperSlide key={image.src} className={"p-4 h-full overflow-hidden"}>
          <div className={"flex flex-col gap-4 h-full"}>
            <img
              id="high-quality-image"
              src={image.src}
              alt="plant"
              className="z-10 object-contain transition-opacity opacity-0 h-full flex-1 overflow-hidden relative object-top"
              {...image.attributes}
              onLoad={onImageLoaded}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className={"flex flex-col gap-4"}>
              <p className={"text-sm text-gray-200"}>{image.location}</p>

              <button
                className={
                  "border-2 border-gray-200 rounded-md px-8 py-2 text-sm w-full"
                }
              >
                Download
              </button>
            </div>
          </div>
        </SwiperSlide>
      );
    }
  );

  return (
    <Swiper
      className={"w-full h-full"}
      slidesPerView={1}
      spaceBetween={0}
      initialSlide={0}
      onSwiper={onSlideChange}
      onSlideChange={onSlideChange}
      cssMode={true}
      edgeSwipeDetection={"prevent"}
      preventInteractionOnTransition={true}
    >
      {slides}
    </Swiper>
  );
}
