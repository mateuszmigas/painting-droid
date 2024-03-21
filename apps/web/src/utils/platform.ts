/// <reference types="vite/client" />

export const isWindows = () =>
  window.navigator.userAgent.indexOf("Windows") !== -1;

export const isWeb = () => import.meta.env.platform === "web";

