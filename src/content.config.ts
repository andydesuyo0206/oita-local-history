// コンテンツコレクション定義：地域別（area）とテーマ別（theme）
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articleSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  order: z.number().default(0),
  icon: z.enum(['torii', 'ship', 'sekibutsu', 'castle', 'yukemuri', 'cross', 'school', 'stadium']),
  // 記事トップの写真（Wikimedia Commons等。クレジット表記必須）
  photo: z
    .object({
      src: z.string(),
      alt: z.string(),
      credit: z.string(),
      license: z.string(),
      sourceUrl: z.string().url(),
    })
    .optional(),
  // 「訪ねるなら」スポット情報
  spots: z
    .array(z.object({ name: z.string(), note: z.string() }))
    .default([]),
  // 出典リンク（ハルシネーション防止のため必須）
  sources: z.array(z.object({ label: z.string(), url: z.string().url() })).min(1),
});

const area = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/area' }),
  schema: articleSchema,
});

const theme = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/theme' }),
  schema: articleSchema,
});

export const collections = { area, theme };
