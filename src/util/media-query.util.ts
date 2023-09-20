// create a function which checks if the current screen size is mobile
export const isMobile = () => {
  return window.innerWidth < 640;
};

// create a function which checks if the current screen size is tablet
export const isTablet = () => {
  return window.innerWidth >= 640 && window.innerWidth < 1024;
};

// create a function which checks if the current screen size is desktop
export const isDesktop = () => {
  return window.innerWidth >= 1024;
};
