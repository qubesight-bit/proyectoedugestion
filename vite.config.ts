// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const cloudUrl =
  process.env["VITE_SUPABASE_URL"] ??
  process.env["SUPABASE_URL"] ??
  "https://hedufqqiqpxywcsvkytj.supabase.co";
const cloudPublishableKey =
  process.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
  process.env["SUPABASE_PUBLISHABLE_KEY"] ??
  process.env["VITE_SUPABASE_ANON_KEY"] ??
  "sb_publishable_wZsh3a4N4U61Tc5J3fg-fQ_haCzhl3g";

const cloudClientEnvPlugin = {
  name: "cloud-client-env",
  enforce: "pre" as const,
  transform(code: string, id: string) {
    if (!id.includes("/src/integrations/supabase/client.ts")) return null;

    return code
      .replace("import.meta.env['VITE_SUPABASE_URL']", JSON.stringify(cloudUrl))
      .replace(
        "import.meta.env['VITE_SUPABASE_PUBLISHABLE_KEY']",
        JSON.stringify(cloudPublishableKey),
      );
  },
};

export default defineConfig({
  vite: {
    // The generated client uses bracket access, which Vite's define option
    // does not replace. Substitute only its two public values before compile.
    plugins: [cloudClientEnvPlugin],
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
