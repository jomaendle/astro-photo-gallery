import React from "react";
import { Icon } from "@iconify/react";

export interface ImageButtonsProps {
  onPrevClick: () => void;
  onNextClick: () => void;
}

export default function ImageButtons({
  onPrevClick,
  onNextClick,
}: ImageButtonsProps): React.ReactElement {
  return (
    <div
      className={
        "hidden justify-center gap-8 pb-2 md:mt-4 md:flex md:justify-start"
      }
    >
      <button
        id={"prev-btn"}
        onClick={onPrevClick}
        title={"Show previous image (or press left arrow key)"}
        aria-label={"Show previous image"}
      >
        <Icon
          icon={"carbon:previous-outline"}
          width={42}
          className={"icon"}
        ></Icon>
      </button>
      <button
        id={"next-btn"}
        onClick={onNextClick}
        title={"Show next image (or press right arrow key)"}
        aria-label={"Show next image"}
      >
        <Icon icon={"carbon:next-outline"} width={42} className={"icon"}></Icon>
      </button>
    </div>
  );
}
