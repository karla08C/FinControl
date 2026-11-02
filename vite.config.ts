import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    server: { entry: "server" },
    client: { entry: "client" },
    spa: { enabled: true },
  },
  nitro: {
    preset: "vercel",
  },
  vite: {
    environments: {
      client: {
        build: {
          rollupOptions: {
            input: {
              index: "./src/client.tsx",
            },
          },
        },
      },
    },
  },
});
