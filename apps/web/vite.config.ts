import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import solidPlugin from "vite-plugin-solid";

const isDesktop = "TAURI_ENV_PLATFORM" in process.env;

const configureResponse = () => {
  return {
    name: "configure-response-headers",
    configureServer: (server) => {
      server.middlewares.use((_req, res, next) => {
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
        next();
      });
    },
  };
};

export default defineConfig(async () => ({
  plugins: [
    react({ exclude: /\.solid\.tsx$/ }),
    solidPlugin({ include: /\.solid\.tsx$/ }),
    configureResponse(),
  ],
  define: {
    "import.meta.env.platform": JSON.stringify(
      "TAURI_ENV_PLATFORM" in process.env
        ? process.env.TAURI_ENV_PLATFORM
        : "web"
    ),
  },
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
