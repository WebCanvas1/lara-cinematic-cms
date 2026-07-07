import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Compat shims so existing components don't need edits
      "@tanstack/react-router": path.resolve(__dirname, "./src/compat/router.tsx"),
      "@tanstack/react-start": path.resolve(__dirname, "./src/compat/start.ts"),
    },
  },
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // In dev, Pages Functions aren't running. Provide an in-memory mock.
      // For real API testing use `wrangler pages dev dist`.
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
});