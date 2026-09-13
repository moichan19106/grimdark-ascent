/**
 * Generates the PWA / Apple touch icon set from an inline brand mark.
 *
 * The mark is a pure-path angular "A" (ASCENT) in bone (#E8E3D9) with a
 * blood (#C43A32) crossbar on the locked dark background (#0B0D0F). No
 * <text> elements, so rendering is identical everywhere (no font deps).
 *
 * Run: bun scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

const OUT_DIR = "public/icons";

/** Full-bleed dark tile + inset hairline frame (for "any" purpose icons). */
const anyIcon = (size) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0B0D0F"/>
  <rect x="18" y="18" width="476" height="476" fill="none"
        stroke="#E8E3D9" stroke-opacity="0.14" stroke-width="4"/>
  <g stroke="#E8E3D9" stroke-width="54" fill="none" stroke-miterlimit="16">
    <path d="M256 118 L118 414"/>
    <path d="M256 118 L394 414"/>
  </g>
  <path d="M168 312 L344 312" stroke="#C43A32" stroke-width="42" fill="none"/>
  <path d="M256 118 L226 182 L286 182 Z" fill="#E8E3D9" stroke="none"/>
</svg>`;

/** Maskable / Apple variant: mark confined to the 80% safe zone, full bleed. */
const maskableIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="#0B0D0F"/>
  <g transform="translate(256 256) scale(0.78) translate(-256 -256)"
     stroke="#E8E3D9" stroke-width="54" fill="none" stroke-miterlimit="16">
    <path d="M256 118 L118 414"/>
    <path d="M256 118 L394 414"/>
  </g>
  <g transform="translate(256 256) scale(0.78) translate(-256 -256)">
    <path d="M168 312 L344 312" stroke="#C43A32" stroke-width="42" fill="none"/>
    <path d="M256 118 L226 182 L286 182 Z" fill="#E8E3D9" stroke="none"/>
  </g>
</svg>`;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  const jobs = [
    { svg: anyIcon(), size: 192, file: "icon-192.png" },
    { svg: anyIcon(), size: 512, file: "icon-512.png" },
    { svg: maskableIcon, size: 512, file: "icon-maskable-512.png" },
    { svg: maskableIcon, size: 180, file: "apple-touch-icon.png" },
  ];

  for (const job of jobs) {
    await sharp(Buffer.from(job.svg))
      .resize(job.size, job.size)
      .png({ compressionLevel: 9 })
      .toFile(`${OUT_DIR}/${job.file}`);
    console.log(`✓ ${OUT_DIR}/${job.file} (${job.size}x${job.size})`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
