import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "/material-dashboard-shadcn-vue/",
  esbuild: {
    jsx: "automatic",
  },
  server: {
    host: "0.0.0.0",
    port: 5000,
  },
  preview: {
    host: "0.0.0.0",
    port: 5000,
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});

