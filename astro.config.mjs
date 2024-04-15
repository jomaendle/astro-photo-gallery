import { defineConfig } from 'astro/config';
import netlify from "@astrojs/netlify";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import db from "@astrojs/db";

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  output: "server",
  integrations: [tailwind({
    nesting: true
  }), react(), db()]
});
