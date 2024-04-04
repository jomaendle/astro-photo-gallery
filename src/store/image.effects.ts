import {
  $imageShareClick,
  $toastShowing,
  type ImageShareClickPayload,
} from "./image.store.ts";
import { showToast } from "../util/toast.ts";

$imageShareClick.listen(async (event: ImageShareClickPayload | null) => {
  if (!event || $toastShowing.get()) {
    return;
  }

  const url = new URL(window.location.href);

  if (navigator.share) {
    console.log("Share API is supported in this browser");
    try {
      await navigator.share({
        url: url.href,
        title: "the beauty of earth",
        text: "Photography by Johannes Maendle",
      });
      console.log("Data was shared successfully");
      showToast(event.toastMessage);

      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
    } catch (err) {
      // @ts-ignore
      console.error("Share failed:", err.message);
    }
  } else if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url.href);
      console.log("URL was copied to clipboard");
      showToast(event.toastMessage);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  } else {
    showToast("Share and Clipboard API are not supported in this browser");
  }
});
