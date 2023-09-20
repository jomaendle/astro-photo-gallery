export function getElementById<T extends HTMLElement>(id: string): T {
  return document.getElementById(id) as T;
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
