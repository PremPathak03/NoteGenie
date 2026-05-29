import { tanstackRouter } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [tanstackRouter(), tailwindcss(), react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
