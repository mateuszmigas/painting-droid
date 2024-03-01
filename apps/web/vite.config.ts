import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isDesktop = "TAURI_PLATFORM" in process.env;

export default defineConfig(async () => ({
  plugins: [react()],
  clearScreen: false,
  server: {
    open: !isDesktop,
    port: 1420,
    strictPort: true,
    watch: {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
