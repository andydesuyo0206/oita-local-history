// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 公開URL（Cloudflare Workers）。OGP・canonical・サイトマップの絶対URL生成に使用。
  // 独自ドメインに移行したらここを変更する。
  site: 'https://oita-local-history.toyonokuni.workers.dev',
  integrations: [sitemap()],
});
