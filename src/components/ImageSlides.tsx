import React, { type SyntheticEvent } from "react";
import { Icon } from "@iconify/react";
import { type GetImageResult } from "astro";
import { setImageFadeInStyle } from "../util/image-fade.util.ts";
import { getImage } from "astro:assets";
import { IMAGE_ID } from "../util/constants.ts";
import { createDownloadElement } from "../util/dom.util.ts";

export type ImageWithMeta = GetImageResult & {
  location: string;
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
    const imageResult = await getImage({
      src: image.src,
      width: image.attributes.width * 2,
      height: image.attributes.height * 2,
      quality: 100,
    });

    createDownloadElement(imageResult.src, image.location);
  }

  return (
    <div className={"flex h-full flex-col gap-2 "}>
      <img
        src={image.src}
        alt=""
        className={[
          "relative z-10 overflow-hidden object-contain object-center opacity-0 transition-opacity md:object-left-top",
          IMAGE_ID,
        ].join(" ")}
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
  );
}
