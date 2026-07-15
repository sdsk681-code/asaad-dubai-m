/**
 * Generates ORIGINAL membership-card artwork (no official logos or copies)
 * for brands that have no real card images, as SVG rendered to PNG via rsvg-convert.
 *
 * Output: artifacts/fazaa/public/cards/<brand>/<type>.png  (850x540, credit-card ratio)
 * Run:    node artifacts/fazaa/scripts/generate-card-images.mjs
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..'); // artifacts/fazaa
const OUT = join(ROOT, 'public', 'cards');
const TMP = '/tmp/cardgen';
mkdirSync(TMP, { recursive: true });

const BRANDS = {
  esaad:   { en: 'ESAAD',          dark: '#145233', mid: '#1e7a4a', light: '#2f9a63' },
  homat:   { en: 'HOMAT AL WATAN', dark: '#253d1a', mid: '#3a5a2a', light: '#4f7a3a' },
  alsaada: { en: 'AL SAADA',       dark: '#0f4a6b', mid: '#1a6b9a', light: '#2a8bc4' },
  absher:  { en: 'ABSHER',         dark: '#0f3d27', mid: '#1a5a3a', light: '#2a7a52' },
};

const TYPES = {
  gold:     { en: 'GOLD',     a1: '#f7e08a', a2: '#c9a227', text: '#f1d97a' },
  silver:   { en: 'SILVER',   a1: '#f0f2f6', a2: '#9aa1ad', text: '#dfe3ea' },
  discount: { en: 'DISCOUNT', a1: '#ffffff', a2: '#e8e8e8', text: '#ffffff' },
};

const FONT = `font-family="DejaVu Sans, Liberation Sans, Noto Sans, sans-serif"`;

/* type marker (top-right), all original vector shapes */
function marker(typeKey, t) {
  if (typeKey === 'gold') {
    // 5-point star
    return `<path d="M778 76 l11.8 24 26.4 3.8 -19.1 18.6 4.5 26.3 -23.6 -12.4 -23.6 12.4 4.5 -26.3 -19.1 -18.6 26.4 -3.8 Z" fill="${t.text}" opacity="0.9"/>`;
  }
  if (typeKey === 'silver') {
    return `<g fill="${t.text}" opacity="0.85">
      <rect x="746" y="72" width="64" height="12" rx="6"/>
      <rect x="754" y="94" width="48" height="12" rx="6"/>
      <rect x="762" y="116" width="32" height="12" rx="6"/>
    </g>`;
  }
  // discount: percent badge
  return `<g opacity="0.9">
    <circle cx="778" cy="102" r="34" fill="none" stroke="${t.text}" stroke-width="5"/>
    <text x="778" y="119" text-anchor="middle" font-size="46" font-weight="bold" fill="${t.text}" ${FONT}>%</text>
  </g>`;
}

function cardSvg(brandKey, typeKey) {
  const b = BRANDS[brandKey];
  const t = TYPES[typeKey];

  // number dots: 4 groups of 4 circles (font-independent)
  let dots = '';
  for (let g = 0; g < 4; g++) {
    for (let i = 0; i < 4; i++) {
      dots += `<circle cx="${86 + g * 168 + i * 30}" cy="398" r="7.5" fill="#ffffff" opacity="0.5"/>`;
    }
  }

  return `<svg width="850" height="540" viewBox="0 0 850 540" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${b.dark}"/>
    <stop offset="0.55" stop-color="${b.mid}"/>
    <stop offset="1" stop-color="${b.light}"/>
  </linearGradient>
  <linearGradient id="chip" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#f7e08a"/>
    <stop offset="1" stop-color="#c9a227"/>
  </linearGradient>
  <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${t.a1}"/>
    <stop offset="1" stop-color="${t.a2}"/>
  </linearGradient>
  <clipPath id="round"><rect width="850" height="540" rx="42"/></clipPath>
</defs>
<g clip-path="url(#round)">
  <rect width="850" height="540" fill="url(#bg)"/>
  <circle cx="730" cy="60" r="270" fill="#ffffff" opacity="0.06"/>
  <circle cx="90" cy="520" r="230" fill="#ffffff" opacity="0.05"/>
  <path d="M-40 420 L890 140" stroke="#ffffff" stroke-width="90" opacity="0.04"/>

  <!-- brand wordmark (original typography, not an official logo) -->
  <text x="72" y="112" font-size="50" font-weight="bold" fill="#ffffff" letter-spacing="2" ${FONT}>${b.en}</text>
  <text x="74" y="150" font-size="19" fill="#ffffff" opacity="0.55" letter-spacing="7" ${FONT}>MEMBERSHIP CARD</text>

  ${marker(typeKey, t)}

  <!-- chip -->
  <rect x="72" y="210" width="112" height="86" rx="14" fill="url(#chip)"/>
  <g stroke="#8a6d1f" stroke-width="3" opacity="0.5">
    <line x1="72" y1="239" x2="184" y2="239"/>
    <line x1="72" y1="267" x2="184" y2="267"/>
    <line x1="128" y1="210" x2="128" y2="296"/>
  </g>

  <!-- contactless -->
  <g fill="none" stroke="#ffffff" stroke-width="6" stroke-linecap="round" opacity="0.6">
    <path d="M228 232 a42 42 0 0 1 0 42"/>
    <path d="M244 220 a62 62 0 0 1 0 66"/>
    <path d="M260 208 a82 82 0 0 1 0 90"/>
  </g>

  ${dots}

  <!-- card type -->
  <text x="72" y="502" font-size="46" font-weight="bold" fill="${t.text}" letter-spacing="4" ${FONT}>${t.en}</text>

  <!-- accent strip -->
  <rect x="0" y="524" width="850" height="16" fill="url(#accent)"/>
</g>
</svg>`;
}

let count = 0;
for (const brandKey of Object.keys(BRANDS)) {
  const dir = join(OUT, brandKey);
  mkdirSync(dir, { recursive: true });
  for (const typeKey of Object.keys(TYPES)) {
    const svgPath = join(TMP, `${brandKey}-${typeKey}.svg`);
    const pngPath = join(dir, `${typeKey}.png`);
    writeFileSync(svgPath, cardSvg(brandKey, typeKey));
    execSync(`rsvg-convert -w 850 -h 540 -o "${pngPath}" "${svgPath}"`);
    count++;
    console.log('✓', pngPath.replace(ROOT + '/', ''));
  }
}
console.log(`Done: ${count} images`);
