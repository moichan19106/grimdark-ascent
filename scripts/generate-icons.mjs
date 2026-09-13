/**
 * Generates the PWA / Apple touch icon set and favicons from the channel logo.
 *
 * Source: public/logo.png
 * Targets:
 *   - public/favicon.ico (multi-res 16, 32, 48)
 *   - public/favicon.png (32x32)
 *   - src/app/icon.png (64x64)
 *   - src/app/apple-icon.png (180x180)
 *   - public/icons/icon-192.png (192x192)
 *   - public/icons/icon-512.png (512x512)
 *   - public/icons/icon-maskable-512.png (512x512)
 *   - public/icons/apple-touch-icon.png (180x180)
 *
 * Run: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";

const LOGO_SRC = "public/logo.png";
const ICONS_DIR = "public/icons";
const APP_DIR = "src/app";

async function createIco(sizes, srcPath, destPath) {
  const pngBuffers = await Promise.all(
    sizes.map((size) =>
      sharp(srcPath)
        .resize(size, size)
        .ensureAlpha()
        .png({ compressionLevel: 9 })
        .toBuffer()
    )
  );

  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: icon
  header.writeUInt16LE(sizes.length, 4); // count

  let offset = 6 + sizes.length * 16;
  const entries = [];

  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(buf.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    offset += buf.length;
  }

  const icoBuffer = Buffer.concat([header, ...entries, ...pngBuffers]);
  await writeFile(destPath, icoBuffer);
  console.log(`✓ ${destPath} (ICO: ${sizes.join(", ")}px)`);
}

async function main() {
  if (!existsSync(LOGO_SRC)) {
    throw new Error(`Logo file not found at ${LOGO_SRC}`);
  }

  await mkdir(ICONS_DIR, { recursive: true });
  await mkdir(APP_DIR, { recursive: true });

  // 1. Generate standard square resized PNGs
  const standardJobs = [
    { target: "public/favicon.png", size: 32 },
    { target: `${APP_DIR}/icon.png`, size: 64 },
    { target: `${APP_DIR}/apple-icon.png`, size: 180 },
    { target: `${ICONS_DIR}/apple-touch-icon.png`, size: 180 },
    { target: `${ICONS_DIR}/icon-192.png`, size: 192 },
    { target: `${ICONS_DIR}/icon-512.png`, size: 512 },
  ];

  for (const job of standardJobs) {
    await sharp(LOGO_SRC)
      .resize(job.size, job.size)
      .png({ compressionLevel: 9 })
      .toFile(job.target);
    console.log(`✓ ${job.target} (${job.size}x${job.size})`);
  }

  // 2. Generate maskable 512x512 icon with 80% safe zone on dark background
  const safeInnerSize = Math.round(512 * 0.8); // ~410px
  const innerBuffer = await sharp(LOGO_SRC)
    .resize(safeInnerSize, safeInnerSize)
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 11, g: 13, b: 15, alpha: 1 }, // #0B0D0F
    },
  })
    .composite([{ input: innerBuffer, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(`${ICONS_DIR}/icon-maskable-512.png`);
  console.log(`✓ ${ICONS_DIR}/icon-maskable-512.png (512x512 maskable)`);

  // 3. Generate multi-resolution favicon.ico
  await createIco([16, 32, 48], LOGO_SRC, "public/favicon.ico");
  await createIco([16, 32, 48], LOGO_SRC, `${APP_DIR}/favicon.ico`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
