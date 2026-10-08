// Нарезка картинок для статической сборки (GitHub Pages): у Pages нет сервера оптимизации,
// поэтому заранее готовим WebP нескольких ширин, а src/lib/image-loader.ts выбирает нужную.
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const WIDTHS = [160, 320, 640, 1080];
const SRC = "public/bloggers";
const OUT = "public/_img";

for (const id of await readdir(SRC)) {
  const dir = path.join(SRC, id);
  await mkdir(path.join(OUT, id), { recursive: true });
  for (const file of await readdir(dir)) {
    if (!file.endsWith(".jpg")) continue;
    const name = file.replace(/\.jpg$/, "");
    for (const w of WIDTHS) {
      await sharp(path.join(dir, file))
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 78 })
        .toFile(path.join(OUT, id, `${name}-${w}.webp`));
    }
  }
}
console.log("images: done");
