import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        // target: "http://18.61.100.138:8080",
        target: "http://localhost:8080",

        changeOrigin: true,
        secure: true,
      },
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: true,
      },
      define: {
  global: {},
}
    },
  },
});
