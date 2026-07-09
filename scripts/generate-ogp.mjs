// OGP画像生成スクリプト：SVGデザインを 1200x630 PNG に変換して public/ogp.png へ出力
// 実行: node scripts/generate-ogp.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, '..', 'public', 'ogp.png');

// 和風モダンのOGPデザイン（フォント依存を避けるため文字はパスではなくSVG textで描き、
// librsvg側でフォールバックされる。日本語はNoto系が無い環境で崩れるため図形中心の構成にする）
const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <!-- 和紙の背景 -->
  <rect width="1200" height="630" fill="#f6f1e7"/>
  <rect width="1200" height="630" fill="url(#grain)" opacity="0.5"/>
  <defs>
    <radialGradient id="grain" cx="20%" cy="15%" r="80%">
      <stop offset="0%" stop-color="#a67c2e" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#b13a2f" stop-opacity="0.04"/>
    </radialGradient>
  </defs>

  <!-- 上下の朱ライン -->
  <rect x="0" y="0" width="1200" height="10" fill="#b13a2f"/>
  <rect x="0" y="620" width="1200" height="10" fill="#b13a2f"/>

  <!-- 遠景の山なみ（由布岳の双耳峰） -->
  <path d="M80 470 L280 330 Q300 310 320 330 L340 350 Q360 330 380 350 L560 470 Z" fill="#2b2a27" opacity="0.14"/>
  <path d="M480 470 L640 360 L790 470 Z" fill="#2b2a27" opacity="0.09"/>

  <!-- 鳥居 -->
  <g>
    <path d="M120 300 Q200 286 280 300 L275 318 Q200 306 125 318 Z" fill="#b13a2f"/>
    <rect x="140" y="328" width="122" height="11" fill="#b13a2f"/>
    <rect x="152" y="318" width="15" height="130" fill="#b13a2f"/>
    <rect x="234" y="318" width="15" height="130" fill="#b13a2f"/>
    <rect x="193" y="300" width="15" height="28" fill="#b13a2f"/>
  </g>

  <!-- 湯けむり -->
  <path d="M620 440 Q608 400 620 370 Q632 340 620 300" stroke="#5d5a52" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.45"/>
  <path d="M660 445 Q648 402 660 372 Q672 342 660 305" stroke="#5d5a52" stroke-width="9" fill="none" stroke-linecap="round" opacity="0.35"/>

  <!-- 石垣と月 -->
  <g>
    <circle cx="1000" cy="150" r="46" fill="#a67c2e" opacity="0.8"/>
    <path d="M840 470 L858 380 L1010 380 L1028 470 Z" fill="#2b2a27" opacity="0.85"/>
    <path d="M865 405 L1003 405 M855 435 L1013 435" stroke="#f6f1e7" stroke-width="3" opacity="0.4"/>
  </g>

  <!-- 海と南蛮船 -->
  <path d="M0 470 Q600 452 1200 470 L1200 620 L0 620 Z" fill="#b13a2f" opacity="0.08"/>
  <g>
    <path d="M960 520 Q1030 534 1100 520 L1085 556 Q1030 566 975 556 Z" fill="#2b2a27"/>
    <rect x="1052" y="430" width="7" height="92" fill="#2b2a27"/>
    <path d="M1059 434 Q1096 458 1059 496 Z" fill="#b13a2f" opacity="0.9"/>
    <path d="M1059 434 L1059 496 L1024 496 Q1040 462 1059 434 Z" fill="#ece3d0" stroke="#2b2a27" stroke-width="2.5"/>
  </g>
  <path d="M120 545 Q140 536 160 545 T200 545 T240 545" stroke="#a67c2e" stroke-width="4" fill="none" opacity="0.6"/>

  <!-- タイトル文字 -->
  <text x="600" y="180" text-anchor="middle" font-family="serif" font-size="76" fill="#2b2a27" letter-spacing="8">豊の国・大分 郷土史</text>
  <text x="600" y="250" text-anchor="middle" font-family="serif" font-size="34" fill="#5d5a52" letter-spacing="12">一千三百年の物語</text>
</svg>
`;

await sharp(Buffer.from(svg)).png().toFile(outPath);
console.log(`生成完了: ${outPath}`);
