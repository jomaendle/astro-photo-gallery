import { $toastShowing } from "../store/image.store.ts";

export const TOAST_WRAPPER_ID = "toast-wrapper";

export const TOAST_CONTENT = "toast-content";

export function showToast(message: string) {
  const toastElement = document.querySelector(
    `#${TOAST_WRAPPER_ID}`
  ) as HTMLDivElement;

  const toastContent = document.getElementById(TOAST_CONTENT);

  if (!toastElement || !toastContent) {
    return;
  }

  $toastShowing.set(true);

  toastElement.style.visibility = "visible";
  toastContent.classList.add("translate-y-12");

  toastContent.innerHTML = `
      <svg
        class="rounded-full bg-green-200/80 p-1 text-green-800"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 16 16"
        ><path
          fill="currentColor"
          d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06a.733.733 0 0 1 1.047 0l3.052 3.093l5.4-6.425a.247.247 0 0 1 .02-.022Z"
        ></path></svg
      >
    <span>${message}</span>
    `;

  setTimeout(() => {
    toastContent.classList.remove("translate-y-12");
    toastContent.classList.add("opacity-0");
  }, 3000);

  setTimeout(() => {
    toastElement.style.visibility = "hidden";
    toastContent.classList.remove("opacity-0");
    toastContent.innerHTML = "";
    $toastShowing.set(false);
  }, 3300);
}
