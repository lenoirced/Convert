// Regenerates public/icons/*.png and public/favicon.png from src/pwa-assets/icon.svg.
// Run with: node scripts/generate-icons.mjs
import sharp from "sharp"
import { mkdirSync } from "node:fs"
import { fileURLToPath } from "node:url"
import path from "node:path"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const source = path.join(root, "src/pwa-assets/icon.svg")

mkdirSync(path.join(root, "public/icons"), { recursive: true })

const targets = [
  { file: "public/icons/icon-192.png", size: 192 },
  { file: "public/icons/icon-512.png", size: 512 },
  { file: "public/favicon.png", size: 48 },
]

for (const { file, size } of targets) {
  await sharp(source, { density: 384 })
    .resize(size, size)
    .png()
    .toFile(path.join(root, file))
  console.log(`wrote ${file} (${size}x${size})`)
}
