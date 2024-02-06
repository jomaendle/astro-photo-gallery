import React, { type SyntheticEvent } from "react";
import { type GetImageResult } from "astro";
import { setImageFadeInStyle } from "../util/image-fade.util.ts";
import { IMAGE_ID } from "../util/constants.ts";
import { createDownloadElement } from "../util/dom.util.ts";
import { getCollection } from "astro:content";
import IconButton from "./IconButton.tsx";
import { $imageShareClick } from "../store/image.store.ts";

export type ImageWithMeta = GetImageResult & {
  location: string;
  id: string;
};

export default function ImageSlides({
  image,
  index,
}: {
  image: ImageWithMeta;
  index: number;
}) {
  function onImageLoaded(event: SyntheticEvent): void {
    setImageFadeInStyle(event.target as HTMLImageElement);
  }

  async function downloadImage() {
    const allImages = await getCollection("images");
    const newImage = allImages.find((img) => img.data.id === image.id);

    if (!newImage) {
      return console.error("Image not found");
    }

    createDownloadElement(newImage.data.image.src, image.location);
  }

  async function shareImage() {
    const allImages = await getCollection("images");
    const newImage = allImages.find((img) => img.data.id === image.id);

    if (!newImage) {
      return console.error("Image not found");
    }

    $imageShareClick.set({
      image: newImage,
      toastMessage: "Copied image link!",
      icon: "bi:check",
    });
  }

  return (
    <div className={"flex h-full flex-col items-center gap-2 "}>
      <img
        src={image.src}
        alt={image.location}
        className={[
          "relative z-10 overflow-hidden object-contain object-center opacity-0 transition-opacity ",
          IMAGE_ID,
        ].join(" ")}
        {...image.attributes}
        onLoad={onImageLoaded}
        loading={index === 0 ? "eager" : "lazy"}
      />
      <div className="swiper-lazy-preloader swiper-lazy-preloader-white flex-1"></div>
      <div className={"flex w-full items-center gap-4 md:w-auto md:flex-row"}>
        <p className={"text-transparent-500 flex-1 text-sm"}>
          {image.location}
        </p>

        <div className={"flex gap-1"}>
          <IconButton
            click={downloadImage}
            tooltip={"Download this image"}
            icon={"bi:download"}
          />

          <IconButton
            click={shareImage}
            tooltip={"Share this image"}
            icon={"bi:share"}
          />
        </div>
      </div>
    </div>
  );
}
