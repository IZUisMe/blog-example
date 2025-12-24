// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import solid from '@astrojs/solid-js';

export default defineConfig({
  // 👇 ここを自分の情報に書き換えます（スペルミスに注意！）
  site: 'https://IZUisMe.github.io',
  base: '/blog-example', 

  integrations: [tailwind(), solid()],
});