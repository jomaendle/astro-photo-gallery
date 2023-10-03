function getContainedSize(img: HTMLImageElement): [number, number] {
  if (!img) {
    return [0, 0];
  }

  const ratio = img.naturalWidth / img.naturalHeight;
  let width = img.height * ratio;
  let height = img.height;

  if (width > img.width) {
    width = img.width;
    height = img.width / ratio;
  }
  return [width, height];
}

export function setMaxWidthForImageWrapper(img: HTMLImageElement | undefined) {
  if (!img) {
    return;
  }

  const [width, height] = getContainedSize(img);
  document.documentElement.style.setProperty(
    "--imageWrapperMaxWidth",
    `${Math.floor(width)}px`
  );
}
