import { Icon } from "@iconify/react";
import React from "react";

export default function IconButton({
  click,
  tooltip,
  icon,
}: {
  tooltip: string;
  icon: string;
  click: () => void;
}) {
  return (
    <button
      title={tooltip}
      onClick={click}
      className="flex aspect-square h-8 w-8 items-center justify-center self-start rounded-full border-gray-200 py-2 transition-colors hover:bg-[rgba(255,255,255,0.1)]"
    >
      <Icon icon={icon} width={18} className={"icon"} />
    </button>
  );
}
