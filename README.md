# 豊の国・大分 郷土史

大分県の郷土史を、自作SVGイラストと写真とともにたどる読み物サイトです。

**🌐 公開サイト：https://oita-local-history.toyonokuni.workers.dev/**

古代の宇佐神宮・六郷満山から、大友宗麟と南蛮貿易、城下町の時代、そして別府温泉の近代観光史まで——「一千三百年の物語」を時代・地域・テーマの3つの軸でまとめています。

- **年表**：古代〜平安／戦国／近世／近代／現代
- **地域**（10）：宇佐・国東／府内／臼杵／竹田／中津／別府／佐伯／日田／杵築／由布院
- **テーマ**（7）：南蛮貿易とキリシタン文化／石仏と磨崖仏の文化／温泉の歴史／キリシタンの光と影／宇佐八幡宮神託事件／現代の大分／修正鬼会

## 特徴

- **出典主義**: 各記事の末尾に出典リンクを明記。出典は frontmatter で1件以上が必須（`src/content.config.ts`）。自治体・観光協会などの公式情報を中心に、Wikipedia 等も併用
- **和風モダンデザイン**: 和紙×墨×朱のパレット、明朝体、自作SVGイラスト。写真は Wikimedia Commons（CC ライセンス）のものを、各記事にクレジット付きで掲載
- **地図ナビゲーション**: 実際の県境データ（GeoJSON）から生成した簡略地図から、各地域の記事へ
- **アクセシビリティ配慮**: `prefers-reduced-motion` 対応、JSなしでも全コンテンツ閲覧可能

## 技術スタック

- [Astro](https://astro.build/) — 静的サイトジェネレーター（Node.js 22.12 以上）
- Content Collections（Markdown）による記事管理
- [@astrojs/sitemap](https://docs.astro.build/en/guides/integrations-guide/sitemap/) — サイトマップ生成
- [sharp](https://sharp.pixelplumbing.com/) — OGP画像・地図確認用の画像生成（開発用）
- 依存フレームワークなしの軽量な素のCSS/JS

## 開発

```bash
npm install
npm run dev      # 開発サーバー
npm run build    # 本番ビルド（dist/ に出力）
npm run preview  # ビルド結果のプレビュー
```

## 記事の追加

`src/content/area/`（地域）または `src/content/theme/`（テーマ）に Markdown を追加します。frontmatter の項目：

| 項目 | 内容 |
|---|---|
| `title` / `subtitle` / `description` | 必須 |
| `order` | 一覧での並び順 |
| `icon` | `torii` `ship` `sekibutsu` `castle` `yukemuri` `cross` `school` `stadium` `taimatsu` `mizushiro` `saka` `yamajiro` `yufudake` のいずれか |
| `photo` | 任意。`src` `alt` `credit` `license` `sourceUrl`（Wikimedia Commons 等。**クレジット表記必須**）。画像は `public/images/` に置く |
| `spots` | 「訪ねるなら」の `name` と `note` の配列 |
| `sources` | **必須（1件以上）**。`label` と `url` |

記事内のリンクは `[表示名](/theme/shujo-onie/)` のようにサイト内パスで書きます。

> **Markdown の注意**：全角括弧で終わる太字の直後に日本語が続くと、`**` が文字のまま表示されます（例：`**修正鬼会（しゅじょうおにえ）**は`）。括弧は太字の外に出してください（`**修正鬼会**（しゅじょうおにえ）は`）。

## デプロイ

Cloudflare Workers で公開しています。GitHub の `main` ブランチへ push すると自動でビルド・デプロイされます（数分で反映）。

公開URLを変える場合（独自ドメインなど）は、`astro.config.mjs` の `site` も更新してください（OGP・canonical・サイトマップの絶対URLに使われます）。

## 補助スクリプト

```bash
node scripts/generate-ogp.mjs       # OGP画像（public/ogp.png）の再生成
node scripts/generate-map-path.mjs  # 地図の県境パスを GeoJSON から生成（開発用）
node scripts/preview-map.mjs        # 地図SVGの形状確認用 PNG の出力（開発用）
```

`generate-map-path.mjs` は、日本の都道府県 GeoJSON（`nam_ja` プロパティを持つもの）を `%TEMP%\japan.geojson` に置いて実行します。このファイルはリポジトリに含まれていません。

## ライセンス

- 写真：各記事に記載のライセンス（CC BY / CC BY-SA など）に従います
- コードと本文のライセンスは、現時点では設定していません
