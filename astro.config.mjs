import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";

import preact from "@astrojs/preact";

const isProd = import.meta.env.PROD;

let baseURL = "/";

if (isProd) {
  baseURL = "/CVTalk";
}

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact()],
  base: baseURL,
  build: {
    assets: "resources",
  },
});
