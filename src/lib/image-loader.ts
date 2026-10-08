// Загрузчик next/image для GitHub Pages: берёт заранее нарезанный WebP (scripts/build-images.mjs)
// самой маленькой ширины, которой хватает для места на экране.
const WIDTHS = [160, 320, 640, 1080];

export default function imageLoader({ src, width }: { src: string; width: number }) {
  const w = WIDTHS.find((x) => x >= width) ?? WIDTHS[WIDTHS.length - 1];
  return src.replace(/\/bloggers\/(.+)\.jpg$/, `/_img/$1-${w}.webp`);
}
