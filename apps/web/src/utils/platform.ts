/// <reference types="vite/client" />

export const isWindows = () =>
  window.navigator.userAgent.indexOf("Windows") !== -1;

export const isWeb = () => import.meta.env.platform === "web";
export const isMobile = () => window.navigator.userAgent.includes("Mobi");
export const isSafari = () =>
  window.navigator.userAgent.includes("Safari") &&
  !window.navigator.userAgent.includes("Chrome") &&
  !window.navigator.userAgent.includes("Firefox");
export const isFirefox = () => window.navigator.userAgent.includes("Firefox");
export const isChrome = () => window.navigator.userAgent.includes("Chrome");
export const appVersion = () => import.meta.env.version;

