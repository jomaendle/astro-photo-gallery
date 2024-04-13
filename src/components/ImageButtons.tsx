import { type ReactElement, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { NEXT_BUTTON_ID, PREV_BUTTON_ID } from "../util/constants.ts";
import Tooltip from "./Tooltip.tsx";

export interface ImageButtonsProps {
  onPrevClick: () => void;
  onNextClick: () => void;
}

export default function ImageButtons({
  onPrevClick,
  onNextClick,
}: ImageButtonsProps): ReactElement {
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  const [showTooltip, setShowTooltip] = useState<{
    show: boolean;
    button: "next" | "prev";
  }>({
    show: false,
    button: "next",
  });

  const handleMouseEnter = (button: "next" | "prev") =>
    setShowTooltip({
      show: true,
      button,
    });

  const handleMouseLeave = (button: "next" | "prev") =>
    setShowTooltip({
      show: false,
      button,
    });

  function getButtonRef() {
    return showTooltip.button === "next"
      ? nextButtonRef.current
      : prevButtonRef.current;
  }

  return (
    <div className={"z-20 hidden justify-center gap-4 pb-2 md:mt-4 md:flex"}>
      {showTooltip.show && getButtonRef() && (
        <Tooltip
          id={"image-button-tooltip"}
          show={showTooltip.show}
          relativeTo={getButtonRef()}
          text={getButtonRef()?.title || ""}
        />
      )}

      <button
        id={PREV_BUTTON_ID}
        ref={prevButtonRef}
        onClick={onPrevClick}
        onMouseEnter={() => handleMouseEnter("prev")}
        onMouseLeave={() => handleMouseLeave("prev")}
        title={"Show previous image (or press left arrow key)"}
        aria-label={"Show previous image"}
      >
        <Icon
          icon={"carbon:previous-outline"}
          width={36}
          className={"icon icon-hover"}
        ></Icon>
      </button>
      <button
        id={NEXT_BUTTON_ID}
        ref={nextButtonRef}
        onClick={onNextClick}
        onMouseEnter={() => handleMouseEnter("next")}
        onMouseLeave={() => handleMouseLeave("next")}
        title={"Show next image (or press right arrow key)"}
        aria-label={"Show next image"}
      >
        <Icon
          icon={"carbon:next-outline"}
          width={36}
          className={"icon icon-hover"}
        ></Icon>
      </button>
    </div>
  );
}
