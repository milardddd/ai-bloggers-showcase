"use client";

import { motion } from "motion/react";
import Image from "next/image";
import type { Blogger } from "@/data/bloggers";
import { haptic } from "@/lib/telegram";

type Props = {
  blogger: Blogger;
  index: number;
  onOpen: (id: string) => void;
};

export function BloggerCard({ blogger, index, onOpen }: Props) {
  const open = () => {
    haptic("light");
    onOpen(blogger.id);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="relative"
    >
      {/* Цветное свечение персонажа под карточкой (градиент вместо blur — дешевле при прокрутке) */}
      <div
        aria-hidden
        className="absolute -inset-x-4 -bottom-14 top-[38%] opacity-40"
        style={{ background: `radial-gradient(closest-side, ${blogger.accent}, ${blogger.accent}80 45%, transparent)` }}
      />
      <motion.button
        type="button"
        onClick={open}
        whileTap={{ scale: 0.975 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        aria-label={`Открыть блог: ${blogger.name}`}
        className="relative block aspect-[4/5] w-full overflow-hidden rounded-[28px] bg-surface text-left ring-1 ring-line"
      >
        <Image
          src={blogger.portrait}
          alt={`${blogger.name} — AI-блогер, ${blogger.topic}`}
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
          preload={index === 0}
          fetchPriority={index === 0 ? "high" : undefined}
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />

        <div className="absolute inset-x-4 top-4 flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs font-medium backdrop-blur-md">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>
            в сети
          </span>
          <span
            className="rounded-full px-2.5 py-1 text-xs font-semibold text-black"
            style={{ background: blogger.accent }}
          >
            {blogger.topic}
          </span>
        </div>

        <div className="@container absolute inset-x-0 bottom-0 p-5">
          <h3 className="font-display text-[26px] leading-[1.05] font-semibold tracking-tight">
            {blogger.name}
          </h3>
          <p className="mt-1 text-sm text-white/60">
            @{blogger.nick} · {blogger.location}
          </p>
          <p className="mt-3 line-clamp-2 text-[15px] leading-snug text-white/85">
            {blogger.tagline}
          </p>
          <div className="mt-4 flex flex-col items-stretch gap-3 @[300px]:flex-row @[300px]:items-center @[300px]:justify-between">
            <span className="text-sm text-white/60">
              <b className="font-semibold text-white">{blogger.followers}</b> подписчиков
            </span>
            <span className="flex h-11 items-center justify-center gap-1.5 whitespace-nowrap rounded-full bg-ink px-5 text-[15px] font-semibold text-black">
              Смотреть блог
              <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
                <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </span>
          </div>
        </div>
      </motion.button>
    </motion.article>
  );
}
