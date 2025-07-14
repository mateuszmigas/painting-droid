/// <reference types="vite/client" />

const IS_APPLE = /Mac|iPod|iPhone|iPad/gi.test(navigator.platform);

export const platform: "web" | "windows" | "darwin" | "linux" | "e2e" = import.meta.env.platform;
export const mode: "development" | "production" = import.meta.env.mode;

export const isProduction = () => mode === "production";
export const isApple = () => IS_APPLE;
export const isMobile = () => window.navigator.userAgent.includes("Mobi");
export const isDesktop = () => platform === "windows" || platform === "darwin" || platform === "linux";
export const appVersion = () => import.meta.env.version;
