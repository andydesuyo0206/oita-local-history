// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // 公開URL（Cloudflare Workers）。OGP・canonicalの絶対URL生成に使用。
  // 独自ドメインに移行したらここを変更する。
  site: 'https://oita-kyodoshi.andydesuyo0206.workers.dev',
});
