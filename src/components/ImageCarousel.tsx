import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import ImageButtons from "@/components/ImageButtons.tsx";
import { useEffect, useState } from "react";
import type { ImageWithMeta } from "@/components/ImageSlides.tsx";
import { setBackgroundColorCssVariable } from "@/util/dom.util.ts";
import { getImageIndex, writeActiveImageIdToUrl } from "@/util/url.util.ts";
import { NEXT_BUTTON_ID, PREV_BUTTON_ID } from "@/util/constants.ts";

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

    const imgElement = document.getElementById(
      currentImage.id
    ) as HTMLImageElement;

    imgElement?.complete && imgElement.classList.remove("opacity-0");
  }

  function isLandscape(image: ImageWithMeta) {
    if (!image.attributes?.width || !image.attributes?.height) {
      return false;
    }

    return image.attributes?.width > image.attributes?.height;
  }

  function onLoadingComplete(e) {
    e.target.classList.remove("opacity-0");
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
        <CarouselPrevious
          className={"z-10 hidden h-10 w-10 shrink-0 sm:flex"}
        />
        <CarouselContent className="flex h-full shrink-0 items-center">
          {(images ?? []).map((img, index) => (
            <CarouselItem
              key={index}
              className="flex h-full max-h-[700px] justify-center"
            >
              <div className={"flex flex-col gap-2"}>
                <img
                  id={img.id}
                  src={img.src}
                  alt={img.location}
                  style={{
                    backgroundColor: img.color,
                    aspectRatio: isLandscape(img) ? "16/11" : "12/16",
                  }}
                  width={img.options?.width}
                  height={img.options?.height}
                  loading={index === 0 ? "eager" : "lazy"}
                  className={`h-full object-cover opacity-0 transition-opacity duration-500 ${
                    isLandscape(images[index])
                      ? ""
                      : "max-w-[300px] md:max-w-[400px]"
                  }`}
                  onLoad={onLoadingComplete}
                />
                <p className={"text-sm text-white/70"}>{img.location}</p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselNext className={"z-10 hidden h-10 w-10 shrink-0 sm:flex"} />
      </Carousel>

      <ImageButtons
        onNextClick={() => onImageChange("next")}
        onPrevClick={() => onImageChange("prev")}
      />
    </div>
  );
}
