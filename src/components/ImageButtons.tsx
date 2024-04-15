import React, { type ReactElement, useRef, useState } from "react";
import { NEXT_BUTTON_ID, PREV_BUTTON_ID } from "../util/constants.ts";
import { ArrowLeft, ArrowRight, Share } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import {
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Tooltip
} from "@/components/ui/tooltip.tsx";

export interface ImageButtonsProps {
  onPrevClick: () => void;
  onNextClick: () => void;
  isPrevDisabled?: boolean;
  isNextDisabled?: boolean;
}

export default function ImageButtons({
                                       onPrevClick,
                                       onNextClick,
                                       isPrevDisabled,
                                       isNextDisabled,
                                     }: ImageButtonsProps): ReactElement {
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div
      className={"z-20 hidden justify-center text-white gap-4 pb-2 md:mt-4 md:flex"}>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"icon"} size={"icon"}
              className={"text-white/70 rounded-full p-2"}
              id={PREV_BUTTON_ID}
              ref={prevButtonRef}
              onClick={onPrevClick}
              title={"Show previous image (or press left arrow key)"}
              aria-label={"Show previous image"}
              disabled={isPrevDisabled}
            >
              <ArrowLeft size={32} strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{prevButtonRef.current?.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={"icon"} size={"icon"}
              className={"text-white/70 rounded-full p-2"}
              id={NEXT_BUTTON_ID}
              ref={nextButtonRef}
              onClick={onNextClick}
              title={"Show next image (or press right arrow key)"}
              aria-label={"Show next image"}
              disabled={isNextDisabled}
            >
              <ArrowRight size={32} strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{nextButtonRef.current?.title}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

    </div>
  );
}
