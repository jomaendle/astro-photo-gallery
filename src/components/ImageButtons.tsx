import React from "react";
import { Icon } from "@iconify/react";
import { NEXT_BUTTON_ID, PREV_BUTTON_ID } from "../util/constants.ts";

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
        id={PREV_BUTTON_ID}
        onClick={onPrevClick}
        title={"Show previous image (or press left arrow key)"}
        aria-label={"Show previous image"}
      >
        <Icon
          icon={"carbon:previous-outline"}
          width={42}
          className={"icon icon-hover"}
        ></Icon>
      </button>
      <button
        id={NEXT_BUTTON_ID}
        onClick={onNextClick}
        title={"Show next image (or press right arrow key)"}
        aria-label={"Show next image"}
      >
        <Icon
          icon={"carbon:next-outline"}
          width={42}
          className={"icon icon-hover"}
        ></Icon>
      </button>
    </div>
  );
}
