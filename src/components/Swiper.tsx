import { Swiper, type SwiperClass, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

import type { GetImageResult } from "astro";
import { getImage } from "astro:assets";

import { type CollectionEntry, getCollection } from "astro:content";
import React, { type SyntheticEvent, useEffect, useState } from "react";
import {
  getImageWidthBasedOnDeviceWidth,
  isMobile,
} from "../util/media-query.util.ts";
import { $currentImageIndex, $slideChange } from "../store/image.store.ts";
import { setImageFadeInStyle } from "../util/image-fade.util.ts";

type ImageWithMeta = GetImageResult & {
  location: string;
};

export default function SwiperWrapper() {
  const [images, setImages] = useState<ImageWithMeta[]>([]);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [showButtons, setShowButtons] = useState<boolean>(false);

  useEffect(() => {
    function handleResize() {
      setShowButtons(!isMobile());
    }
    window.addEventListener("resize", handleResize);

    handleResize();
  }, []);

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
          className={"p-4 h-full overflow-hidden "}
          virtualIndex={index}
        >
          <div className={"flex flex-col gap-4 h-full"}>
            <img
              src={image.src}
              alt="plant"
              className="high-quality-image z-10 object-contain transition-opacity opacity-0 h-full flex-1 overflow-hidden relative object-top"
              {...image.attributes}
              onLoad={onImageLoaded}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white flex-1"></div>
            <div className={"swiper-pagination"}></div>
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
    <>
      <Swiper
        className={"w-full h-full overflow-hidden"}
        slidesPerView={1}
        spaceBetween={0}
        initialSlide={0}
        onSlideChange={onSlideChange}
        onSwiper={setSwiper}
        cssMode={true}
        edgeSwipeDetection={"prevent"}
        preventInteractionOnTransition={true}
      >
        {slides}
      </Swiper>

      {showButtons && (
        <div className={"flex gap-2"}>
          <button onClick={onPrevClick}>Prev</button>
          <button onClick={onNextClick}>Next</button>
        </div>
      )}
    </>
  );
}
