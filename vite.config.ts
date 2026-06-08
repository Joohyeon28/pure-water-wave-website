import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Force root base for Firebase hosting to avoid MIME/type HTML responses
  // when serving built assets from the `dist` folder.
  const base = "/";
  const isVercel = Boolean(process.env.VERCEL);
  const isNetlify = Boolean(process.env.NETLIFY);
  return {
    base,

    server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  };
});
