"use client";

import { motion } from "motion/react";
import type { MouseEvent } from "react";
import { getWebApp, haptic } from "@/lib/telegram";
import { useTelegramUrl } from "@/lib/use-telegram-url";

export function TelegramIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.94 4.3a1.2 1.2 0 0 0-1.62-1.33L2.9 9.86c-1.05.42-1.03 1.9.03 2.29l4.3 1.56 1.66 5.33c.2.65 1 .88 1.52.44l2.43-2.04 4.53 3.33c.7.52 1.7.13 1.88-.72L21.94 4.3ZM9.6 13.22l8.13-6.3-6.7 7.33-.3 3.33-1.13-4.36Z" />
    </svg>
  );
}

/** Переход по ссылке в Telegram: внутри Mini App её открывает сам Telegram, без выхода во внешний браузер */
export function openTelegram(e: MouseEvent<HTMLAnchorElement>, href: string) {
  haptic("medium");
  const app = getWebApp();
  if (app) {
    e.preventDefault();
    app.openTelegramLink(href);
  }
}

type Props = {
  bloggerId?: string;
  label?: string;
  className?: string;
  size?: "md" | "lg";
  /** Пульсирующее кольцо — привлечь внимание после окончания демо-диалога */
  pulse?: boolean;
};

export function TelegramButton({
  bloggerId,
  label = "Перейти в Telegram",
  className = "",
  size = "lg",
  pulse = false,
}: Props) {
  const href = useTelegramUrl(bloggerId);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => openTelegram(e, href);

  const button = (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-2xl bg-tg font-semibold text-white shadow-[0_8px_24px_-14px_rgba(42,171,238,0.6)] ${
        size === "lg" ? "h-14 text-[17px]" : "h-12 text-[15px]"
      } ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent will-change-transform animate-[shine_3.6s_ease-in-out_infinite]"
      />
      <TelegramIcon />
      <span className="relative">{label}</span>
    </motion.a>
  );

  if (!pulse) return button;
  return (
    <div className="relative">
      <motion.span
        aria-hidden
        className="absolute inset-0 rounded-2xl ring-2 ring-tg"
        initial={{ opacity: 0.8, scale: 1 }}
        animate={{ opacity: 0, scale: 1.12 }}
        transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
      />
      {button}
    </div>
  );
}
