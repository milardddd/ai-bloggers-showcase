import type { NextConfig } from "next";

// Сборка для GitHub Pages: статичные файлы в out/, сайт живёт по адресу /ai-bloggers-showcase
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? "/ai-bloggers-showcase" : "";

const nextConfig: NextConfig = {
  /* config options here */
  // PPR несовместим со статическим экспортом; страница целиком клиентская, на Pages он не нужен
  cacheComponents: !isPages,
  partialPrefetching: !isPages,
  ...(isPages && { output: "export", basePath }),
  // На GitHub Pages нет сервера оптимизации картинок — отдаём файлы как есть
  images: { unoptimized: isPages },
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  // Разрешаем открывать dev-сервер с телефона в локальной сети
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
