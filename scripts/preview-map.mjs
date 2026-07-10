// 地図SVGの形状確認用：OitaMap.astroと同じパス・ノード配置をPNG化する開発用スクリプト
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const regions = [
  { label: '中津', x: 145, y: 85 },
  { label: '宇佐・国東', x: 340, y: 88 },
  { label: '杵築', x: 390, y: 140 },
  { label: '日田', x: 125, y: 235 },
  { label: '別府', x: 322, y: 200 },
  { label: '由布院', x: 272, y: 222 },
  { label: '府内', x: 400, y: 242 },
  { label: '臼杵', x: 422, y: 300 },
  { label: '竹田', x: 235, y: 330 },
  { label: '佐伯', x: 398, y: 372 },
];

const nodes = regions
  .map(
    (r) => `<circle cx="${r.x}" cy="${r.y}" r="16" fill="#b13a2f" opacity="0.18"/>
<circle cx="${r.x}" cy="${r.y}" r="4.5" fill="#b13a2f"/>
<text x="${r.x}" y="${r.y + 34}" text-anchor="middle" font-family="serif" font-size="17" fill="#2b2a27">${r.label}</text>`
  )
  .join('\n');

const svg = `<svg width="560" height="440" viewBox="0 0 560 440" xmlns="http://www.w3.org/2000/svg">
<rect width="560" height="440" fill="#f6f1e7"/>
<rect width="560" height="440" fill="#b13a2f" opacity="0.05"/>
<path d="M105 95 Q160 72 225 70 Q250 66 268 72 C290 30 360 12 415 40 C452 62 462 105 442 138 Q430 155 410 162 Q368 172 346 190 Q352 212 388 214 L505 194 Q512 199 505 204 L448 226 Q454 252 444 264 Q462 274 456 294 Q443 307 453 322 Q466 340 451 357 Q436 364 443 380 Q449 402 426 414 Q360 427 300 417 Q230 404 185 400 Q130 394 118 352 Q95 302 92 252 Q88 192 98 142 Q100 112 105 95 Z"
 fill="#ece3d0" stroke="#a67c2e" stroke-width="2.5" stroke-linejoin="round"/>
<path d="M268 195 L282 173 L292 187 L300 175 L312 195 Z" fill="#2b2a27" opacity="0.15"/>
<path d="M170 300 L190 272 L210 300 Z M200 304 L216 282 L232 304 Z" fill="#2b2a27" opacity="0.12"/>
${nodes}
</svg>`;

const out = join(__dirname, '..', '..', 'map-preview.png');
await sharp(Buffer.from(svg)).png().toFile(out);
console.log('生成完了:', out);
