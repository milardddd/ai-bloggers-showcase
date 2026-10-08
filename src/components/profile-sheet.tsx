"use client";

import { AnimatePresence, animate, motion, useIsPresent, useMotionValue } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Blogger } from "@/data/bloggers";
import { getWebApp, haptic } from "@/lib/telegram";
import { ChatDemo } from "./chat-demo";
import { PostFeed } from "./post-feed";
import { TelegramButton } from "./telegram-button";

type Tab = "feed" | "chat";

type Props = {
  bloggers: Blogger[];
  index: number;
  initialTab: Tab;
  onIndexChange: (index: number) => void;
  onClose: () => void;
};

export function ProfileSheet({ bloggers, index, initialTab, onIndexChange, onClose }: Props) {
  const blogger = bloggers[index];
  const [tab, setTab] = useState<Tab>(initialTab);
  const [direction, setDirection] = useState(0);
  const [chatSeen, setChatSeen] = useState(initialTab === "chat");
  const [ctaPulse, setCtaPulse] = useState(false);
  // Ленту и чат монтируем, когда шит доехал: в первый кадр выезда остаётся только лёгкая шапка
  const [entered, setEntered] = useState(false);
  // Смещение при перетаскивании за ручку. Обычный pan вместо drag: drag включал в Motion
  // систему замеров раскладки, и монтирование шита давало рывок в первый кадр
  const dragY = useMotionValue(0);
  // Во время анимации закрытия шит уже не должен перехватывать касания страницы
  const isPresent = useIsPresent();
  const rootRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const tabsAnchorRef = useRef<HTMLDivElement>(null);
  // Чтобы тап-зоны не срабатывали в конце свайпа
  const panned = useRef(false);

  const go = (delta: number) => {
    const next = (index + delta + bloggers.length) % bloggers.length;
    haptic("selection");
    setDirection(delta);
    onIndexChange(next);
    setCtaPulse(false);
    bodyRef.current?.scrollTo({ top: 0 });
  };

  const selectTab = (t: Tab) => {
    haptic("selection");
    setTab(t);
    if (t === "chat") {
      setChatSeen(true);
      // Пользователь сам выбрал чат — плавно поднимаем табы к верху, чтобы диалог был виден
      const body = bodyRef.current;
      const anchor = tabsAnchorRef.current;
      if (body && anchor && body.scrollTop < anchor.offsetTop) {
        body.scrollTo({ top: anchor.offsetTop, behavior: "smooth" });
      }
    }
  };

  // Фокус возвращается туда, откуда шит открыли (сам шит получает фокус, когда доедет)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    return () => opener?.focus({ preventScroll: true });
  }, []);

  // Esc и системная кнопка «Назад» в Telegram: сначала закрывают открытый пост, потом шит.
  // Tab не выходит за пределы шита.
  useEffect(() => {
    const back = () => {
      if (document.querySelector("[data-post-viewer]")) window.dispatchEvent(new Event("mirra:close-post"));
      else onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
      if (e.key !== "Tab" || !rootRef.current) return;
      const items = rootRef.current.querySelectorAll<HTMLElement>("a[href], button:not([tabindex='-1'])");
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const tgBack = getWebApp()?.BackButton;
    tgBack?.onClick(back);
    tgBack?.show();
    return () => {
      window.removeEventListener("keydown", onKey);
      tgBack?.offClick(back);
      tgBack?.hide();
    };
  }, [onClose]);

  return (
    <div ref={rootRef} tabIndex={-1} className={`fixed inset-0 z-50 outline-none ${isPresent ? "" : "pointer-events-none"}`} role="dialog" aria-modal aria-label={`Профиль: ${blogger.name}`}>
      <motion.div
        className="absolute inset-x-0 top-0 h-[200lvh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.2 } }}
        onClick={onClose}
      />

      <motion.div
        className="absolute inset-x-0 bottom-0 mx-auto h-[94dvh] max-w-[520px]"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%", transition: { duration: 0.28, ease: [0.32, 0, 0.67, 0] } }}
        transition={{ type: "spring", stiffness: 340, damping: 36 }}
        onAnimationComplete={() => {
          // focus() форсирует пересчёт раскладки — делаем его после выезда, а не в первый кадр
          if (!entered) rootRef.current?.focus({ preventScroll: true });
          setEntered(true);
        }}
      >
      <motion.div
        className="relative flex h-full flex-col rounded-t-[30px] bg-surface shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.8)] after:absolute after:inset-x-0 after:top-full after:h-[100lvh] after:bg-surface after:content-['']"
        style={{ y: dragY }}
      >
        {/* Зона захвата: тянем вниз — закрываем */}
        <motion.div
          className="absolute inset-x-0 top-0 z-20 flex h-5 cursor-grab touch-none justify-center pt-2 active:cursor-grabbing"
          onPan={(_, info) => dragY.set(Math.max(0, info.offset.y) * 0.7)}
          onPanEnd={(_, info) => {
            if (info.offset.y > 120 || info.velocity.y > 700) onClose();
            else animate(dragY, 0, { type: "spring", stiffness: 400, damping: 36 });
          }}
        >
          <span className="h-1 w-9 rounded-full bg-white/40" />
        </motion.div>


        <div ref={bodyRef} className="no-scrollbar flex-1 overflow-y-auto overscroll-contain rounded-t-[30px] pb-[calc(var(--safe-bottom)+88px)]">
          {/* Обложка: свайп влево/вправо — следующий персонаж */}
          <motion.div
            className="relative h-[46dvh] max-h-[460px] min-h-[300px] touch-pan-y overflow-hidden"
            onPanStart={() => {
              panned.current = true;
            }}
            onPanEnd={(_, info) => {
              setTimeout(() => (panned.current = false), 0);
              if (Math.abs(info.offset.x) > 60 && Math.abs(info.offset.x) > Math.abs(info.offset.y)) {
                go(info.offset.x < 0 ? 1 : -1);
              }
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={blogger.id}
                custom={direction}
                className="absolute inset-0"
                variants={{
                  enter: (d: number) => ({ x: d >= 0 ? "40%" : "-40%", opacity: 0, scale: 1.05 }),
                  center: { x: 0, opacity: 1, scale: 1 },
                  exit: (d: number) => ({ x: d >= 0 ? "-25%" : "25%", opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "spring", stiffness: 300, damping: 34 }}
              >
                <motion.div
                  className="absolute inset-0"
                  initial={{ scale: 1.12 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Image
                    src={blogger.portrait}
                    alt={blogger.name}
                    fill
                    preload
                    sizes="(min-width: 520px) 520px, 100vw"
                    className="object-cover object-[50%_25%]"
                    draggable={false}
                  />
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
                <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/60 to-transparent" />
              </motion.div>
            </AnimatePresence>

            <button
              type="button"
              onClick={onClose}
              className="absolute top-10 right-3 z-20 flex size-11 items-center justify-center rounded-full bg-black/45"
              aria-label="Закрыть"
            >
              <svg viewBox="0 0 20 20" className="size-5" fill="currentColor" aria-hidden>
                <path d="M5.3 5.3a1 1 0 0 1 1.4 0L10 8.6l3.3-3.3a1 1 0 1 1 1.4 1.4L11.4 10l3.3 3.3a1 1 0 0 1-1.4 1.4L10 11.4l-3.3 3.3a1 1 0 0 1-1.4-1.4L8.6 10 5.3 6.7a1 1 0 0 1 0-1.4Z" />
              </svg>
            </button>

            {/* Индикатор персонажей, как в сторис */}
            <div className="absolute inset-x-4 top-0 z-10 flex gap-1">
              {bloggers.map((b, i) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => i !== index && go(i - index)}
                  className="flex h-11 flex-1 items-center"
                  aria-label={b.name}
                >
                  <span
                    className="block h-[3px] w-full rounded-full transition-colors duration-300"
                    style={{ background: i === index ? blogger.accent : "rgba(255,255,255,0.3)" }}
                  />
                </button>
              ))}
            </div>

            {/* Тап-зоны как в сторис Instagram: левая треть — назад, правая — вперёд */}
            {[-1, 1].map((d) => (
              <button
                key={`tap${d}`}
                type="button"
                tabIndex={-1}
                aria-hidden
                onClick={() => !panned.current && go(d)}
                className={`absolute top-24 bottom-0 z-[5] w-1/3 sm:hidden ${d < 0 ? "left-0" : "right-0"}`}
              />
            ))}

            {/* Стрелки — для десктопа, на мобильном работает тап и свайп */}
            <div className="pointer-events-none absolute inset-y-0 inset-x-3 z-10 hidden items-center justify-between sm:flex">
              {[-1, 1].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => go(d)}
                  className="pointer-events-auto flex size-11 items-center justify-center rounded-full bg-black/50 transition hover:bg-black/60"
                  aria-label={d < 0 ? "Предыдущий персонаж" : "Следующий персонаж"}
                >
                  <svg viewBox="0 0 20 20" fill="currentColor" className={`size-5 ${d < 0 ? "rotate-180" : ""}`} aria-hidden>
                    <path d="M7.3 4.3a1 1 0 0 1 1.4 0l5 5a1 1 0 0 1 0 1.4l-5 5a1 1 0 1 1-1.4-1.4L11.6 10 7.3 5.7a1 1 0 0 1 0-1.4Z" />
                  </svg>
                </button>
              ))}
            </div>

            <motion.div
              key={`title-${blogger.id}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="absolute inset-x-0 bottom-0 z-10 px-5 pb-4"
            >
              <span
                className="mb-2 inline-block rounded-full px-2.5 py-1 text-xs font-semibold text-black"
                style={{ background: blogger.accent }}
              >
                {blogger.topic}
              </span>
              <h2 className="font-display text-[30px] leading-none font-semibold tracking-tight">{blogger.name}</h2>
              <p className="mt-1.5 text-sm text-white/60">
                @{blogger.nick} · {blogger.age} · {blogger.location}
              </p>
            </motion.div>
          </motion.div>

          <div className="px-5">
            <div className="grid grid-cols-3 divide-x divide-line rounded-2xl bg-surface-2 py-3 text-center">
              {[
                [blogger.followers, "подписчиков"],
                [String(blogger.postsCount), "публикаций"],
                [blogger.replyTime, "ответ"],
              ].map(([value, label]) => (
                <div key={label}>
                  <p className="font-display text-[17px] font-semibold">{value}</p>
                  <p className="text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[15px] leading-relaxed text-white/80">{blogger.bio}</p>
          </div>

          <div ref={tabsAnchorRef} />
          {/* Табы прилипают к верху шита при прокрутке */}
          <div className="sticky top-0 z-10 bg-surface px-4 pt-6 pb-2">
            <div className="relative flex rounded-2xl bg-surface-2 p-1">
              {/* Пилюля едет между табами обычным transform: layoutId заставлял Motion измерять раскладку при открытии шита */}
              <motion.span
                aria-hidden
                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-xl bg-white/10"
                initial={false}
                animate={{ x: tab === "feed" ? "0%" : "100%" }}
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
              {(
                [
                  ["feed", "Лента"],
                  ["chat", `Написать ${blogger.nameDative}`],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => selectTab(key)}
                  className="relative flex h-11 flex-1 items-center justify-center gap-2 text-[15px] font-semibold"
                >
                  <span className={`relative transition-colors ${tab === key ? "text-ink" : "text-muted"}`}>{label}</span>
                  {key === "chat" && !chatSeen && (
                    <span className="relative flex size-2">
                      <span className="absolute inset-0 animate-ping rounded-full opacity-75" style={{ background: blogger.accent }} />
                      <span className="relative size-2 rounded-full" style={{ background: blogger.accent }} />
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="min-h-[40dvh]">
            {!entered ? null : tab === "feed" ? (
              <PostFeed key={`feed-${blogger.id}`} blogger={blogger} />
            ) : (
              <ChatDemo key={`chat-${blogger.id}`} blogger={blogger} onFinish={() => setCtaPulse(true)} />
            )}
          </div>
        </div>

        {/* Плавающая кнопка без подложки — как на главной */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 px-4 pb-[calc(var(--safe-bottom)+12px)]">
          <div className="pointer-events-auto">
            <TelegramButton
              bloggerId={blogger.id}
              pulse={ctaPulse}
              className="shadow-none!"
            />
          </div>
        </div>
      </motion.div>
      </motion.div>
    </div>
  );
}
