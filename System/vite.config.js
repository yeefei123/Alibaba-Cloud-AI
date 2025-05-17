import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8080", // or 3000, 5000 — whatever your backend runs on
        changeOrigin: true,
      },
    },
  },
});
