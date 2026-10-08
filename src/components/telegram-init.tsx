"use client";

import Script from "next/script";
import { getWebApp } from "@/lib/telegram";

/** Подключает Telegram WebApp SDK: внутри Mini App разворачиваемся на весь экран. */
export function TelegramInit() {
  return (
    <Script
      src="https://telegram.org/js/telegram-web-app.js"
      strategy="afterInteractive"
      onLoad={() => {
        const app = getWebApp();
        app?.ready();
        app?.expand();
      }}
    />
  );
}
