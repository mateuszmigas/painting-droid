/// <reference types="vite/client" />

export const platform: "web" | "windows" | "darwin" | "linux" = import.meta.env
  .platform;

console.log("platform", platform);

export const isWindowsDesktopOrWeb = () =>
  window.navigator.userAgent.indexOf("Windows") !== -1;
export const isWeb = () => import.meta.env.platform === "web";
export const isMobile = () => window.navigator.userAgent.includes("Mobi");
export const appVersion = () => import.meta.env.version;

