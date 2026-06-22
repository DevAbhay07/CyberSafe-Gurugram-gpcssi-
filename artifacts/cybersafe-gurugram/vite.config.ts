import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// ─── Port & base path ─────────────────────────────────────────────────────────
// On Replit, PORT and BASE_PATH are injected as env vars.
// Locally, fall back to Vite's default (5173) and root path ("/").

const port = Number(process.env.PORT ?? 5173);

// ─── Replit-only plugins (only loaded when running inside Replit) ─────────────
// These plugins are no-ops outside Replit — they only activate when REPL_ID
// is set.  Safe to keep or remove; they are NOT installed by default any more.
const replitPlugins =
  process.env.NODE_ENV !== "production" &&
  process.env.REPL_ID !== undefined
    ? await Promise.all([
        import("@replit/vite-plugin-cartographer").then((m) =>
          m.cartographer({ root: path.resolve(import.meta.dirname, "..") })
        ),
        import("@replit/vite-plugin-dev-banner").then((m) => m.devBanner()),
      ])
    : [];

export default defineConfig({
  base: "/",
  plugins: [react(), tailwindcss(), ...replitPlugins],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(
        import.meta.dirname,
        "..",
        "..",
        "attached_assets"
      ),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist"),
    emptyOutDir: true,
  },
  server: {
    port,
    // strictPort: false — allow Vite to pick next available port locally
    strictPort: !!process.env.PORT,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
