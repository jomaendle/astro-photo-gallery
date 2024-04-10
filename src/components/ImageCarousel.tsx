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

export function ImageCarousel({
  images,
  lowResImages,
}: {
  images: ImageWithMeta[];
  lowResImages: ImageWithMeta[];
}) {
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }

    updateBackground();

    api.on("select", () => updateBackground());

    window.addEventListener("keydown", (event) => {
      console.log(event.key);
      if (event.key === "ArrowRight") {
        onImageChange("next");
      }

      if (event.key === "ArrowLeft") {
        onImageChange("prev");
      }
    });

    return () => {
      api.destroy();
    };
  }, [api]);

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
  }

  function isLandscape(image: ImageWithMeta) {
    if (!image.attributes?.width || !image.attributes?.height) {
      return false;
    }

    return image.attributes?.width > image.attributes?.height;
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
          {(lowResImages ?? []).map((img, index) => (
            <CarouselItem
              key={index}
              className="flex h-full max-h-[700px] justify-center"
            >
              <img
                src={images[index].src}
                alt=""
                style={{
                  backgroundColor: images[index].color,
                  aspectRatio: isLandscape(images[index]) ? "16/11" : "10/16",
                }}
                width={images[index].options?.width}
                height={images[index].options?.height}
                loading={index === 0 ? "eager" : "lazy"}
                className={`border-8 border-white object-cover ${
                  isLandscape(images[index])
                    ? ""
                    : "max-w-[300px] md:max-w-[500px]"
                }`}
              />
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
