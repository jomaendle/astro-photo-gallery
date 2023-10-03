import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import { Icon } from "@iconify/react";

import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";

import { type CollectionEntry, getCollection } from "astro:content";
import React, { type SyntheticEvent, useEffect, useState } from "react";
import { getImageWidthBasedOnDeviceWidth } from "../util/media-query.util.ts";
import { $currentImageIndex, $slideChange } from "../store/image.store.ts";
import { setImageFadeInStyle } from "../util/image-fade.util.ts";
import { Virtual } from "swiper/modules";

type ImageWithMeta = GetImageResult & {
  location: string;
};

export default function SwiperWrapper() {
  const [images, setImages] = useState<ImageWithMeta[]>([]);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    const preferredImageWidth = getImageWidthBasedOnDeviceWidth();
    const loadImages = async (): Promise<ImageWithMeta[]> => {
      const imageCollection = await getCollection("images");
      return await Promise.all(
        imageCollection.map(async (image: CollectionEntry<"images">) => {
          const imageResult = await getImage({
            src: image.data.image,
            width: preferredImageWidth,
            quality: 82,
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

    $slideChange.set({
      previousIndex: swiper.previousIndex,
      activeIndex: swiper.activeIndex,
    });
  }

  function onImageLoaded(event: SyntheticEvent<HTMLImageElement, Event>): void {
    setImageFadeInStyle(event.target as HTMLImageElement);
  }

  function onPrevClick() {
    swiper?.slidePrev();
  }

  function onNextClick() {
    swiper?.slideNext();
  }

  const slides: React.JSX.Element[] = images.map(
    (image: ImageWithMeta, index: number) => {
      return (
        <SwiperSlide
          key={image.src}
          className={"flex h-full justify-center overflow-hidden p-4"}
          virtualIndex={index}
        >
          <div
            className={"flex h-full flex-col gap-2"}
            style={{ maxWidth: "var(--imageWrapperMaxWidth)" }}
          >
            <img
              src={image.src}
              alt="plant"
              className="high-quality-image relative z-10 overflow-hidden object-contain object-top opacity-0 transition-opacity"
              {...image.attributes}
              onLoad={onImageLoaded}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white flex-1"></div>
            <div className={"flex items-center gap-4 md:flex-row"}>
              <p className={"text-transparent-500 flex-1 text-sm"}>
                {image.location}
              </p>
              <button
                className={
                  "self-start rounded-full border-gray-200 py-2 md:py-2"
                }
              >
                <Icon icon="bi:download" width={20} className={"icon"}></Icon>
              </button>
            </div>
          </div>
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
        edgeSwipeDetection={"prevent"}
        preventInteractionOnTransition={true}
        virtual={false}
        modules={[Virtual]}
      >
        {slides}
      </Swiper>

      <div className={"hidden justify-center gap-8 md:flex"}>
        <button onClick={onPrevClick}>
          <Icon
            icon={"carbon:previous-outline"}
            width={42}
            className={"icon"}
          ></Icon>
        </button>
        <button onClick={onNextClick}>
          <Icon
            icon={"carbon:next-outline"}
            width={42}
            className={"icon"}
          ></Icon>
        </button>
      </div>
    </div>
  );
}
