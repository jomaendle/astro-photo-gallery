export function getElementById<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
}

export function getElementsByClassName<T extends HTMLElement>(
  className: string
): T[] {
  return Array.from(document.getElementsByClassName(className)) as T[];
}

/**
 * Class operations
 */
export function addClassesToElement(element: HTMLElement, classes: string[]) {
  classes.forEach((className) => {
    element.classList.add(className);
  });
}

export function removeClassesFromElement(
  element: HTMLElement,
  classes: string[]
) {
  classes.forEach((className) => {
    element.classList.remove(className);
  });
}

export function createDownloadElement(src: string, name: string): void {
  const link = document.createElement("a");
  link.href = src;
  link.download = `${name}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
