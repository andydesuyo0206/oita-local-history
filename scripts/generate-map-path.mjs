// 大分県の実ポリゴン（GeoJSON）から地図SVGパスを生成する開発用スクリプト
// 使い方: node scripts/generate-map-path.mjs [許容誤差(km)]
import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const tolerance = Number(process.argv[2] ?? 1.2); // km相当の簡略化許容誤差

const geo = JSON.parse(readFileSync(join(process.env.TEMP, 'japan.geojson'), 'utf8'));
const oita = geo.features.find((f) => f.properties.nam_ja === '大分県');
if (!oita) throw new Error('大分県が見つかりません');

// 最大リング（本土）を取得（MultiPolygon想定）
let rings = [];
if (oita.geometry.type === 'MultiPolygon') rings = oita.geometry.coordinates.map((p) => p[0]);
else rings = [oita.geometry.coordinates[0]];
const main = rings.reduce((a, b) => (b.length > a.length ? b : a));
console.log('rings:', rings.map((r) => r.length).join(','), '-> main:', main.length);

// 等積っぽい平面座標へ（経度はcos(緯度)補正、1度≈111km）
const latAvg = main.reduce((s, p) => s + p[1], 0) / main.length;
const kx = 111 * Math.cos((latAvg * Math.PI) / 180);
const ky = 111;
const pts = main.map(([lon, lat]) => [lon * kx, -lat * ky]); // yは下向きに反転

// Douglas-Peucker 簡略化
function dp(points, eps) {
  if (points.length < 3) return points;
  const [sx, sy] = points[0];
  const [ex, ey] = points[points.length - 1];
  let maxD = 0, idx = 0;
  const dx = ex - sx, dy = ey - sy;
  const len = Math.hypot(dx, dy) || 1e-9;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const d = Math.abs(dy * px - dx * py + ex * sy - ey * sx) / len;
    if (d > maxD) { maxD = d; idx = i; }
  }
  if (maxD > eps) {
    const left = dp(points.slice(0, idx + 1), eps);
    const right = dp(points.slice(idx), eps);
    return left.slice(0, -1).concat(right);
  }
  return [points[0], points[points.length - 1]];
}
// 閉リング対策：始点から最も遠い点で2分割してから簡略化する
// （始点=終点のままdpにかけると基準線が長さ0になり全点が潰れる）
const p0 = pts[0];
let farIdx = 0, farD = -1;
for (let i = 1; i < pts.length; i++) {
  const d = Math.hypot(pts[i][0] - p0[0], pts[i][1] - p0[1]);
  if (d > farD) { farD = d; farIdx = i; }
}
const half1 = dp(pts.slice(0, farIdx + 1), tolerance);
const half2 = dp(pts.slice(farIdx), tolerance);
const simplified = half1.slice(0, -1).concat(half2.slice(0, -1));

// 560x440ビューへスケーリング（余白28px）
const xs = simplified.map((p) => p[0]);
const ys = simplified.map((p) => p[1]);
const minX = Math.min(...xs), maxX = Math.max(...xs);
const minY = Math.min(...ys), maxY = Math.max(...ys);
const pad = 28, W = 560, H = 440;
const scale = Math.min((W - pad * 2) / (maxX - minX), (H - pad * 2) / (maxY - minY));
const ox = (W - (maxX - minX) * scale) / 2;
const oy = (H - (maxY - minY) * scale) / 2;
const toXY = ([px, py]) => [
  Math.round(((px - minX) * scale + ox) * 10) / 10,
  Math.round(((py - minY) * scale + oy) * 10) / 10,
];
const path =
  'M' + simplified.map((p) => toXY(p).join(' ')).join(' L') + ' Z';

// 地域ノードの緯度経度 → SVG座標
const regions = [
  ['中津', 33.598, 131.188],
  ['宇佐・国東', 33.56, 131.45],
  ['杵築', 33.417, 131.616],
  ['日田', 33.321, 130.941],
  ['別府', 33.284, 131.491],
  ['由布院', 33.264, 131.369],
  ['府内', 33.238, 131.612],
  ['臼杵', 33.126, 131.804],
  ['竹田', 32.973, 131.398],
  ['佐伯', 32.96, 131.9],
];
const nodes = regions.map(([label, lat, lon]) => {
  const [x, y] = toXY([lon * kx, -lat * ky]);
  return { label, x, y };
});

console.log('points:', simplified.length);
console.log('PATH:', path);
console.log('NODES:', JSON.stringify(nodes));

// プレビューPNG生成
const nodeSvg = nodes
  .map(
    (n) => `<circle cx="${n.x}" cy="${n.y}" r="15" fill="#b13a2f" opacity="0.18"/>
<circle cx="${n.x}" cy="${n.y}" r="4" fill="#b13a2f"/>
<text x="${n.x}" y="${n.y + 30}" text-anchor="middle" font-family="serif" font-size="16" fill="#2b2a27">${n.label}</text>`
  )
  .join('\n');
const svg = `<svg width="560" height="440" xmlns="http://www.w3.org/2000/svg">
<rect width="560" height="440" fill="#f6f1e7"/>
<rect width="560" height="440" fill="#b13a2f" opacity="0.05"/>
<path d="${path}" fill="#ece3d0" stroke="#a67c2e" stroke-width="2.5" stroke-linejoin="round"/>
${nodeSvg}
</svg>`;
const out = join(__dirname, '..', 'map-real-preview.png');
await sharp(Buffer.from(svg)).png().toFile(out);
writeFileSync(join(__dirname, '..', 'map-path.txt'), path + '\n\n' + JSON.stringify(nodes, null, 2));
console.log('生成完了:', out);
