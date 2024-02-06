export default function Tooltip({
  show,
  text,
  relativeTo,
  id,
}: {
  id: string;
  show: boolean;
  text: string;
  relativeTo: HTMLElement | null;
}) {
  return (
    <div
      id={id}
      style={{
        top: (relativeTo?.offsetTop || 0) - 40,
        left: relativeTo?.offsetLeft || 0,
      }}
      className={[
        "absolute z-30 rounded-md bg-gray-800 px-3 py-1.5 text-xs text-gray-100 shadow-md",
        show ? "opacity-100" : "opacity-0",
      ].join(" ")}
    >
      {text}
    </div>
  );
}
