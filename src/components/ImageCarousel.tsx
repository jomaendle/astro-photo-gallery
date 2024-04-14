import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ImageButtons from "@/components/ImageButtons.tsx";
import React, { type SyntheticEvent, useEffect, useState } from "react";
import { setBackgroundColorCssVariable } from "@/util/dom.util.ts";
import { getImageIndex, writeActiveImageIdToUrl } from "@/util/url.util.ts";
import { NEXT_BUTTON_ID, PREV_BUTTON_ID } from "@/util/constants.ts";
import IconButton from "@/components/IconButton.tsx";
import { $imageShareClick } from "@/store/image.store.ts";
import type { GetImageResult } from "astro";

export type ImageWithMeta = GetImageResult & {
  location: string;
  id: string;
  color: string;
};

export function ImageCarousel({ images }: { images: ImageWithMeta[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    setStartIndex(getImageIndex(images) ?? 0);
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.scrollTo(startIndex);
  }, [api, startIndex]);

  useEffect(() => {
    if (!api) {
      return;
    }

    updateBackground();

    api.on("select", () => updateBackground());

    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        addFocusStyles(NEXT_BUTTON_ID);
        onImageChange("next");
      }

      if (event.key === "ArrowLeft") {
        addFocusStyles(PREV_BUTTON_ID);
        onImageChange("prev");
      }
    });

    return () => {
      api.destroy();
    };
  }, [api]);

  function addFocusStyles(buttonId: string) {
    const classes = [
      "outline",
      "outline-blue-300/80",
      "rounded-full",
      "-outline-offset-2",
      "outline-2",
    ];
    const button = document.getElementById(buttonId);
    button?.classList.add(...classes);

    setTimeout(() => {
      button?.classList.remove(...classes);
    }, 300);
  }

  function onImageChange(direction: "next" | "prev") {
    if (!api) {
      return;
    }

    if (direction === "next") {
      api.scrollNext();
    } else {
      api.scrollPrev();
    }
  }

  function updateBackground() {
    if (!api) {
      return;
    }

    const currentImage = images[api.selectedScrollSnap()];
    setBackgroundColorCssVariable(currentImage.color);

    if (!currentImage.id) {
      return;
    }

    writeActiveImageIdToUrl(currentImage.id);
    onLoadingComplete(currentImage.id);
  }

  function isLandscape(image: ImageWithMeta) {
    if (!image.attributes?.width || !image.attributes?.height) {
      return false;
    }

    return image.attributes?.width > image.attributes?.height;
  }

  function onLoadingComplete(imageId: string) {
    const imgElement = document.getElementById(imageId) as HTMLImageElement;

    if (imgElement) {
      imgElement.complete &&
        imgElement.parentElement?.classList.remove("opacity-0");
      document.getElementById("loading-" + imageId)?.classList.add("opacity-0");
    }
  }

  async function shareImage(img: ImageWithMeta) {
    const newImage = img.id;

    if (!newImage) {
      return console.error("Image not found");
    }

    $imageShareClick.set({
      toastMessage: "Copied image link",
    });
  }

  return (
    <div className={"flex h-full flex-col gap-2"}>
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
        }}
        onClick={(e) => e.stopPropagation()}
        className="relative mx-auto flex h-full w-full items-center justify-center gap-4 overflow-hidden sm:max-w-lg lg:max-w-2xl"
      >
        <CarouselContent className="flex h-full shrink-0 items-center">
          {(images ?? []).map((img, index) => (
            <CarouselItem
              key={index}
              className="relative flex h-full max-h-[700px] justify-center"
            >
              <div
                id={"loading-" + img.id}
                className={
                  "absolute inset-0 z-0 flex items-center justify-center transition-opacity duration-500"
                }
              >
                <svg
                  className="h-8 w-8 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="8"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V2.5"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                </svg>
              </div>
              <div
                className={
                  "z-10 flex h-full flex-col gap-2 opacity-0 transition-opacity duration-500"
                }
                style={{
                  maxWidth: isLandscape(img) ? "100%" : "400px",
                }}
              >
                <img
                  id={img.id}
                  src={img.src}
                  alt={img.location}
                  style={{
                    backgroundColor: img.color,
                    aspectRatio: isLandscape(img) ? "16/11" : "12/16",
                    maxHeight: "calc(100% - (40px))",
                  }}
                  width={img.options?.width}
                  height={img.options?.height}
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding={"async"}
                  className={`w-full object-cover`}
                  onLoad={() => onLoadingComplete(img.id)}
                />
                <div className={"flex items-center gap-4"}>
                  <p className={"location flex-1 text-xs text-white/70"}>
                    {img.location}
                  </p>
                  <IconButton
                    click={() => shareImage(img)}
                    tooltip={"Share this image"}
                    icon={"bi:share"}
                  />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <ImageButtons
        onNextClick={() => onImageChange("next")}
        onPrevClick={() => onImageChange("prev")}
      />
    </div>
  );
}
