import React, { type SyntheticEvent, useEffect, useRef, useState } from "react";
import { type GetImageResult } from "astro";
import { setImageFadeInStyle } from "../util/image-fade.util.ts";
import { IMAGE_ID } from "../util/constants.ts";
import IconButton from "./IconButton.tsx";
import { $imageShareClick } from "../store/image.store.ts";

import "./ImageSlides.css";

export type ImageWithMeta = GetImageResult & {
  location: string;
  id: string;
};

export default function ImageSlides({
  image,
  index,
  imagePreview,
}: {
  image: ImageWithMeta;
  imagePreview: ImageWithMeta;
  index: number;
}) {
  const bgImageRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const imageElement = imageRef.current;
    const bgImageElement = bgImageRef.current;

    if (bgImageElement && imageElement?.complete) {
      setTimeout(() => {
        bgImageRef.current?.classList.remove("blur-[30px]");
      }, 200);
      setImageFadeInStyle(imageElement);
      setImageLoaded(true);
    }
  }, [imageRef, bgImageRef]);

  function onImageLoaded(event: SyntheticEvent): void {
    setTimeout(() => {
      bgImageRef.current?.classList.remove("blur-[30px]");
    }, 200);
    setImageFadeInStyle(event.target as HTMLImageElement);
    setImageLoaded(true);
  }

  async function shareImage() {
    const newImage = image.id;

    if (!newImage) {
      return console.error("Image not found");
    }

    $imageShareClick.set({
      toastMessage: "Copied image link!",
    });
  }

  return (
    <>
      {!imageLoaded && (
        <div
          className={"absolute inset-0 z-40 flex items-center justify-center"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 300 150"
            className={"animate-stroke w-[100px]"}
          >
            <path
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="300 385"
              strokeDashoffset="0"
              d="M275 75c0 31-27 50-50 50-58 0-92-100-150-100-28 0-50 22-50 50s23 50 50 50c58 0 92-100 150-100 24 0 50 19 50 50Z"
            ></path>
          </svg>
        </div>
      )}

      <div className={"flex h-full flex-col items-center gap-2 "}>
        <div
          ref={bgImageRef}
          className={`z-0 overflow-hidden bg-cover bg-center blur-[30px]`}
          style={{
            backgroundImage: `url(${imagePreview.src})`,
            transition: "all 0.5s ease",
          }}
        >
          <img
            src={image.src}
            alt={image.location}
            ref={imageRef}
            style={{
              transition: `all 0.5s ease`,
              backgroundColor: "var(--backgroundColor)",
            }}
            className={[
              "relative z-20 h-full w-full overflow-hidden object-contain object-center opacity-0 transition-opacity ",
              IMAGE_ID,
            ].join(" ")}
            {...image.attributes}
            onLoad={onImageLoaded}
          />
        </div>

        {imageLoaded && (
          <div
            className={
              "z-20 flex w-full items-center gap-4 md:w-auto md:flex-row"
            }
          >
            <p className={"text-transparent-500 flex-1 text-sm"}>
              {image.location}
            </p>

            <div className={"flex gap-1"}>
              <IconButton
                click={shareImage}
                tooltip={"Share this image"}
                icon={"bi:share"}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
