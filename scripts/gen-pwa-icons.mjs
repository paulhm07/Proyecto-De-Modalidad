// Genera iconos PWA (192, 512, maskable, apple-touch) para Mundilex
// Usa sharp para componer el búho sobre un fondo degradado espacial.
import sharp from "sharp";
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUB = resolve(__dirname, "../public");
const OUT = resolve(PUB, "pwa");
mkdirSync(OUT, { recursive: true });

const owlSvg = readFileSync(resolve(PUB, "logo.svg"), "utf-8");

// Fondo espacial degradado (coincide con el themeColor #07061f de la app)
// + sutil brillo radial para dar profundidad.
function bgSvg(size, pad) {
  const s = size;
  return `<svg width="${s}" height="${s}" viewBox="0 0 ${s} ${s}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="space" cx="50%" cy="38%" r="75%">
      <stop offset="0%" stop-color="#1e1b4b"/>
      <stop offset="45%" stop-color="#0b0a2a"/>
      <stop offset="100%" stop-color="#07061f"/>
    </radialGradient>
    <radialGradient id="glow" cx="50%" cy="40%" r="40%">
      <stop offset="0%" stop-color="#a855f7" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${s}" height="${s}" fill="url(#space)"/>
  <rect width="${s}" height="${s}" fill="url(#glow)"/>
  <!-- estrellas diminutas -->
  ${Array.from({ length: 26 }, () => {
    const x = Math.floor(Math.random() * s);
    const y = Math.floor(Math.random() * s);
    const r = (Math.random() * 1.2 + 0.4).toFixed(2);
    const o = (Math.random() * 0.5 + 0.3).toFixed(2);
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="#fde68a" opacity="${o}"/>`;
  }).join("\n  ")}
</svg>`;
}

// Compone búho sobre fondo. pad = fracción del tamaño reservada como padding.
async function build(size, pad, file, maskable = false) {
  const bg = Buffer.from(bgSvg(size, pad));
  const owlSize = Math.round(size * (1 - pad * 2));
  const owlBuf = Buffer.from(owlSvg);
  const owlPng = await sharp(owlBuf).resize(owlSize, owlSize).png().toBuffer();
  const offset = Math.round(size * pad);

  let comp = [
    { input: owlPng, left: offset, top: offset },
  ];

  if (maskable) {
    // Anillo sutil para que se vea bien en cualquier recorte maskable
    const ring = Buffer.from(
      `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" fill="none" stroke="#fbbf24" stroke-opacity="0.18" stroke-width="6"/>
      </svg>`
    );
    comp.unshift({ input: ring, left: 0, top: 0 });
  }

  await sharp(bg).composite(comp).png().toFile(resolve(OUT, file));
  console.log("✓", file, `${size}x${size}`);
}

// Apple touch icon: fondo sólido + búho (sin transparencia, iOS lo exige)
async function appleTouch() {
  const size = 180;
  const bg = Buffer.from(
    `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="#0b0a2a"/>
    </svg>`
  );
  const owlSize = Math.round(size * 0.66);
  const owlPng = await sharp(Buffer.from(owlSvg)).resize(owlSize, owlSize).png().toBuffer();
  const off = Math.round((size - owlSize) / 2);
  await sharp(bg).composite([{ input: owlPng, left: off, top: off }]).png().toFile(resolve(OUT, "apple-touch-icon.png"));
  console.log("✓ apple-touch-icon.png", `${size}x${size}`);
}

// Favicon ICO-like (32px png)
async function favicon() {
  const size = 32;
  const bg = Buffer.from(bgSvg(size, 0.12));
  const owlSize = Math.round(size * 0.76);
  const owlPng = await sharp(Buffer.from(owlSvg)).resize(owlSize, owlSize).png().toBuffer();
  const off = Math.round((size - owlSize) / 2);
  await sharp(bg).composite([{ input: owlPng, left: off, top: off }]).png().toFile(resolve(UBPUB(size)));
}

function UBPUB(size) {
  return resolve(PUB, `favicon-${size}.png`);
}

await build(192, 0.16, "icon-192.png");
await build(512, 0.16, "icon-512.png");
await build(512, 0.24, "icon-512-maskable.png", true);
await appleTouch();
await favicon();

console.log("\nIconos PWA generados en /public/pwa/");
