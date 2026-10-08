"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Blogger, Post } from "@/data/bloggers";
import { haptic } from "@/lib/telegram";
import { useTelegramUrl } from "@/lib/use-telegram-url";
import { openTelegram } from "./telegram-button";

const formatLikes = (n: number) =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(".0", "").replace(".", ",")}K` : String(n);

function LockIcon({ className = "size-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill="none" stroke="currentColor" strokeWidth={2}>
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" strokeLinecap="round" />
    </svg>
  );
}

// «1 публикация», «3 публикации», «485 публикаций»
const pluralPosts = (n: number) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "публикация";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "публикации";
  return "публикаций";
};

// Разное кадрирование размытого портрета, чтобы закрытые посты не выглядели одинаково
const lockedCrops = ["object-[30%_15%]", "object-[70%_60%]", "object-[50%_95%]"];

function HeartIcon({ filled, className = "size-5" }: { filled?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2}>
      <path d="M12 20.5s-7.5-4.6-9.3-9.2C1.4 8 3.6 4.5 7.2 4.5c2 0 3.6 1.1 4.8 2.8 1.2-1.7 2.8-2.8 4.8-2.8 3.6 0 5.8 3.5 4.5 6.8-1.8 4.6-9.3 9.2-9.3 9.2Z" strokeLinejoin="round" />
    </svg>
  );
}

export function PostFeed({ blogger }: { blogger: Blogger }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [liked, setLiked] = useState<Record<string, boolean>>({});
  const active = blogger.posts.find((p) => p.id === openId);
  const telegramHref = useTelegramUrl(blogger.id);

  const toggleLike = (id: string, value?: boolean) =>
    setLiked((l) => ({ ...l, [id]: value ?? !l[id] }));

  return (
    <>
      <div className="grid grid-cols-2 gap-2 px-4 pt-2 pb-4">
        {blogger.posts.map((post, i) =>
          post.locked ? (
            // Закрытый пост: размытое превью ведёт в Telegram, где «лежат» остальные публикации
            <motion.a
              key={post.id}
              href={telegramHref}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => openTelegram(e, telegramHref)}
              initial={{ opacity: 0, transform: "translateY(16px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileTap={{ scale: 0.97 }}
              className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2"
              aria-label="Публикация доступна в Telegram"
            >
              <Image
                src={post.image}
                alt=""
                fill
                sizes="64px"
                className={`scale-125 object-cover blur-xl ${lockedCrops[(i - 1) % lockedCrops.length]}`}
              />
              <div className="absolute inset-0 bg-black/35" />
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-black/40 ring-1 ring-white/15">
                  <LockIcon className="size-5" />
                </span>
                <span className="text-xs font-semibold text-white/90">В Telegram</span>
              </span>
              <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-xs font-semibold">
                <HeartIcon className="size-3.5" />
                {formatLikes(post.likes)}
              </span>
              <span className="absolute right-2.5 bottom-2.5 text-xs text-white/60">{post.ago}</span>
            </motion.a>
          ) : (
          <motion.button
            key={post.id}
            type="button"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => {
              haptic("light");
              setOpenId(post.id);
            }}
            className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-surface-2 text-left"
            aria-label={`Открыть публикацию: ${post.caption}`}
          >
            <Image src={post.image} alt="" fill sizes="(min-width: 520px) 250px, 50vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent" />
            <span className="absolute bottom-2.5 left-2.5 flex items-center gap-1 text-xs font-semibold">
              <HeartIcon filled={liked[post.id]} className={`size-3.5 ${liked[post.id] ? "text-rose-500" : ""}`} />
              {formatLikes(post.likes + (liked[post.id] ? 1 : 0))}
            </span>
            <span className="absolute right-2.5 bottom-2.5 text-xs text-white/60">{post.ago}</span>
          </motion.button>
          ),
        )}
      </div>

      <a
        href={telegramHref}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => openTelegram(e, telegramHref)}
        className="mx-auto -mt-1 mb-2 flex w-fit items-center gap-1.5 px-4 py-2 text-sm font-medium text-white/70"
      >
        Ещё {blogger.postsCount - 1} {pluralPosts(blogger.postsCount - 1)} в Telegram
        <svg viewBox="0 0 20 20" fill="currentColor" className="size-4" aria-hidden>
          <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
        </svg>
      </a>

      <AnimatePresence>
        {active && (
          <PostViewer
            key={active.id}
            post={active}
            blogger={blogger}
            liked={!!liked[active.id]}
            onLike={(v) => toggleLike(active.id, v)}
            onClose={() => setOpenId(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

type ViewerProps = {
  post: Post;
  blogger: Blogger;
  liked: boolean;
  onLike: (value?: boolean) => void;
  onClose: () => void;
};

function PostViewer({ post, blogger, liked, onLike, onClose }: ViewerProps) {
  const lastTap = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
    // Esc и «Назад» в Telegram приходят от шита событием — он сам решает, что закрывать
    window.addEventListener("mirra:close-post", onClose);
    return () => window.removeEventListener("mirra:close-post", onClose);
  }, [onClose]);

  const onImageTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 300) {
      haptic("medium");
      onLike(true);
      setBurst((b) => b + 1);
    }
    lastTap.current = now;
  };

  return (
    <motion.div
      ref={rootRef}
      tabIndex={-1}
      className="fixed inset-0 z-[70] flex flex-col bg-black outline-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal
      aria-label="Публикация"
      data-post-viewer
    >
      <motion.div
        className="mx-auto flex h-full w-full max-w-[520px] flex-col"
        initial={{ y: 40, scale: 0.96 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 30 }}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 110 || info.velocity.y > 600) onClose();
        }}
      >
        <div className="flex items-center gap-3 px-4 pt-[calc(var(--safe-top)+12px)] pb-3">
          <div className="relative size-9 overflow-hidden rounded-full" style={{ boxShadow: `0 0 0 2px ${blogger.accent}` }}>
            <Image src={blogger.avatar} alt="" fill sizes="36px" className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{blogger.nick}</p>
            <p className="text-xs text-muted">{post.ago} назад</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-11 items-center justify-center rounded-full bg-white/10"
            aria-label="Закрыть"
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="currentColor" aria-hidden>
              <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
            </svg>
          </button>
        </div>

        <div className="relative my-auto aspect-[4/5] w-full select-none" onClick={onImageTap}>
          <Image src={post.image} alt={post.caption} fill sizes="(min-width: 520px) 520px, 100vw" className="object-cover" draggable={false} />
          <AnimatePresence>
            {burst > 0 && (
              <motion.div
                key={burst}
                className="pointer-events-none absolute inset-0 flex items-center justify-center text-white drop-shadow-2xl"
                initial={{ scale: 0.3, opacity: 0 }}
                animate={{ scale: [0.3, 1.2, 1], opacity: [0, 1, 1] }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.45 }}
                onAnimationComplete={() => setTimeout(() => setBurst(0), 250)}
              >
                <HeartIcon filled className="size-28" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="px-4 pt-4 pb-[calc(var(--safe-bottom)+20px)]">
          <div className="flex items-center gap-3">
            <motion.button
              type="button"
              whileTap={{ scale: 0.8 }}
              onClick={() => {
                haptic("light");
                onLike();
              }}
              className={`flex size-11 items-center justify-center rounded-full bg-white/10 ${liked ? "text-rose-500" : ""}`}
              aria-pressed={liked}
              aria-label="Нравится"
            >
              <motion.span key={String(liked)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15 }}>
                <HeartIcon filled={liked} className="size-6" />
              </motion.span>
            </motion.button>
            <span className="text-sm font-semibold">{formatLikes(post.likes + (liked ? 1 : 0))} отметок</span>
          </div>
          <p className="mt-3 text-[15px] leading-relaxed text-white/85">
            <b className="font-semibold text-white">{blogger.nick}</b> {post.caption}
          </p>
          <p className="mt-2 text-xs text-muted">Дважды коснись фото, чтобы поставить лайк · смахни вниз, чтобы закрыть</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
