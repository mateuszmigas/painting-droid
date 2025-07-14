import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import packageJson from "../../package.json";

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

export default defineConfig(async (configEnv) => ({
  plugins: [react({ exclude: /\.solid\.tsx$/ }), solidPlugin({ include: /\.solid\.tsx$/ }), configureResponse()],
  build: {
    chunkSizeWarningLimit: 1024,
  },
  define: {
    "import.meta.env.mode": JSON.stringify(configEnv.mode),
    "import.meta.env.platform": JSON.stringify(
      "TAURI_ENV_PLATFORM" in process.env
        ? process.env.TAURI_ENV_PLATFORM
        : process.env.E2E_TESTS === "true"
          ? "e2e"
          : "web",
    ),
    "import.meta.env.version": JSON.stringify(packageJson.version),
  },
  clearScreen: false,
  server: {
    open: !isDesktop,
    port: isDesktop ? 1420 : 1421,
    strictPort: true,
    watch: {},
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    include: ["src/**/*.test.ts", "src/**/*.test.tsx"],
  },
}));
