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
import ImageButtons from "./ImageButtons.tsx";

type ImageWithMeta = GetImageResult & {
  location: string;
};

export default function SwiperWrapper() {
  const [images, setImages] = useState<ImageWithMeta[]>([]);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);

  useEffect(() => {
    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        onNextClick();
      }

      if (event.key === "ArrowLeft") {
        onPrevClick();
      }
    });
  }, [swiper]);

  useEffect(() => {
    const preferredImageWidth = getImageWidthBasedOnDeviceWidth();
    const loadImages = async (): Promise<ImageWithMeta[]> => {
      const imageCollection = await getCollection("images");
      return await Promise.all(
        imageCollection.map(async (image: CollectionEntry<"images">) => {
          const imageResult = await getImage({
            src: image.data.image,
            width: preferredImageWidth,
            quality: 90,
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
    const prevIcon = document.getElementById("prev-btn");
    const icon = prevIcon?.children.item(0);
    const textClass = "text-gray-500";
    icon?.classList.add(textClass);

    setTimeout(() => {
      icon?.classList.remove(textClass);
    }, 340);

    prevIcon?.focus();
    swiper?.slidePrev();
  }

  function onNextClick() {
    const nextIcon = document.getElementById("next-btn");
    const icon = nextIcon?.children.item(0);
    const textClass = "text-[rgba(255,255,255,0.1)]";
    icon?.classList.add(textClass);

    setTimeout(() => {
      icon?.classList.remove(textClass);
    }, 400);

    nextIcon?.focus();
    swiper?.slideNext();
  }

  async function downloadImage() {
    const image = images[swiper?.activeIndex ?? 0];

    const imageResult = await getImage({
      src: image.src,
      width: image.attributes.width * 2,
      height: image.attributes.height * 2,
      quality: 100,
    });

    const link = document.createElement("a");
    link.href = imageResult.src;
    link.download = `${image.location}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const slides: React.JSX.Element[] = images.map(
    (image: ImageWithMeta, index: number) => {
      return (
        <SwiperSlide
          key={image.src}
          className={"flex h-full justify-center overflow-hidden"}
          virtualIndex={index}
        >
          <div
            className={"flex h-full flex-col gap-2 "}
            style={{ maxWidth: "var(--imageWrapperMaxWidth)" }}
          >
            <img
              src={image.src}
              alt="plant"
              className="high-quality-image relative z-10 overflow-hidden object-contain object-center opacity-0 transition-opacity md:object-left-top"
              {...image.attributes}
              onLoad={onImageLoaded}
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="swiper-lazy-preloader swiper-lazy-preloader-white flex-1"></div>
            <div className={"flex items-center gap-4 md:flex-row"}>
              <p className={"text-transparent-500 text-sm"}>{image.location}</p>
              <button
                title={"Download this image"}
                className={
                  "flex aspect-square h-10 w-10 items-center justify-center self-start rounded-full border-gray-200 py-2 transition-colors hover:bg-[rgba(255,255,255,0.1)] md:py-2"
                }
              >
                <Icon
                  icon="bi:download"
                  width={20}
                  className={"icon"}
                  onClick={downloadImage}
                ></Icon>
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

      <ImageButtons onNextClick={onNextClick} onPrevClick={onPrevClick} />
    </div>
  );
}
