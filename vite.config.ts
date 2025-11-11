import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Ensure the HMR client connects to the same port to avoid stale HMR tries
    // when the server previously ran on a different port. This helps prevent
    // the browser trying to poll an old dev server port (e.g. 8081) after restarts.
    hmr: {
      host: 'localhost',
      port: 8080,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
