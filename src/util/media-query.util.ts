export const MOBILE_WIDTH = 640;
export const TABLET_WIDTH = 1024;
export const DESKTOP_WIDTH = 1920;

// create a function which checks if the current screen size is mobile
export const isMobile = () => {
  return window.innerWidth < MOBILE_WIDTH;
};

// create a function which checks if the current screen size is tablet
export const isTablet = () => {
  return window.innerWidth >= MOBILE_WIDTH && window.innerWidth < TABLET_WIDTH;
};

// create a function which checks if the current screen size is desktop
export const isDesktop = () => {
  return window.innerWidth >= DESKTOP_WIDTH;
};

export function getImageWidthBasedOnDeviceWidth(): number {
  if (isMobile()) {
    return MOBILE_WIDTH;
  } else if (isTablet()) {
    return TABLET_WIDTH;
  } else {
    return DESKTOP_WIDTH;
  }
}
