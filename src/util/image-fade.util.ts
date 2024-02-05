export function setImageFadeInStyle(image: HTMLImageElement) {
  if (!image) {
    throw new Error("setImageFadeInStyle: Image not found");
  }

  console.log("setImageFadeInStyle: Image found", image.alt);

  image.classList.add("opacity-100");
  image.classList.remove("opacity-0");
}

export function setImageFadeOutStyle(image: HTMLImageElement) {
  if (!image) {
    throw new Error("setImageFadeOutStyle: Image not found");
  }

  image.classList.add("opacity-0");
  image.classList.remove("opacity-100");
}
