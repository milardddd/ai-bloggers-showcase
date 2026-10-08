"use client";

import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { bloggers } from "@/data/bloggers";
import { haptic } from "@/lib/telegram";
import { BloggerCard } from "./blogger-card";
import { ProfileSheet } from "./profile-sheet";
import { StickyCta } from "./sticky-cta";
import { TelegramButton } from "./telegram-button";

type OpenState = { index: number; tab: "feed" | "chat" } | null;

const ease = [0.22, 1, 0.36, 1] as const;

const steps = [
  { title: "Выбери персонажа", text: "Лайфстайл, бизнес, мода или приключения — у каждого свой характер и голос." },
  { title: "Познакомься", text: "Листай ленту и начни диалог прямо здесь: персонаж ответит в своём стиле." },
  { title: "Продолжи в Telegram", text: "Личные сообщения, память о разговорах и истории, которых нет на сайте." },
];

export function Showcase() {
  const [open, setOpen] = useState<OpenState>(null);
  const finalRef = useRef<HTMLElement>(null);
  const finalInView = useInView(finalRef, { margin: "0px 0px -80px 0px" });

  const openBlogger = (id: string, tab: "feed" | "chat" = "feed") =>
    setOpen({ index: bloggers.findIndex((b) => b.id === id), tab });
  const close = useCallback(() => setOpen(null), []);

  const showSticky = !open && !finalInView;

  return (
    <MotionConfig reducedMotion="user">

      {/* Своя область прокрутки вместо окна: на iOS 26 контент больше не уезжает под
          статус-бар и тулбар Safari, там всегда сплошной фон страницы */}
      <div
        id="scroll-root"
        // Непрозрачный фон: Safari 26 берёт его цвет для статус-бара и не рисует свой полупрозрачный блюр
        className="no-scrollbar fixed inset-0 overflow-x-hidden overflow-y-auto bg-bg"
      >
      {/* Фоновое «северное сияние» из акцентов персонажей.
          Радиальные градиенты вместо filter: blur — тот же мягкий свет, но без перерисовки размытия
          на каждом кадре дрейфа (на телефонах blur(120px) в движении сильно тормозил) */}
      <motion.div aria-hidden animate={{ opacity: open ? 0 : 1 }} transition={{ duration: 0.3 }} className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[280px] -left-[248px] size-[660px] will-change-transform animate-[drift_18s_ease-in-out_infinite]" style={{ background: "radial-gradient(closest-side, rgb(255 92 138 / 0.18), rgb(255 92 138 / 0.081) 55%, transparent)" }} />
        <div className="absolute -top-10 -right-[280px] size-[620px] will-change-transform animate-[drift_22s_ease-in-out_infinite_reverse]" style={{ background: "radial-gradient(closest-side, rgb(92 225 230 / 0.14), rgb(92 225 230 / 0.063) 55%, transparent)" }} />
        <div className="absolute top-[calc(60vh-120px)] left-[calc(25%-120px)] size-[600px] will-change-transform animate-[drift_26s_ease-in-out_infinite]" style={{ background: "radial-gradient(closest-side, rgb(183 156 255 / 0.1), rgb(183 156 255 / 0.045) 55%, transparent)" }} />
      </motion.div>
      {/* При открытом профиле затемняем саму страницу: на iOS 26 фиксированный бэкдроп
          не дотягивается до зоны под статус-баром, и там проглядывал яркий контент */}
      <motion.main
        animate={{ opacity: open ? 0.12 : 1 }}
        transition={{ duration: 0.3 }}
        className="relative mx-auto w-full max-w-6xl px-4 pb-[calc(var(--safe-bottom)+112px)] sm:px-6"
      >
        <header className="flex items-center justify-between pt-[calc(var(--safe-top)+16px)]">
          <span className="font-display text-lg font-bold tracking-[0.18em]">
            MIRRA<span className="text-[#FF5C8A]">.</span>
          </span>
          <span className="flex items-center gap-2 rounded-full border border-line bg-white/5 px-3 py-1.5 text-xs font-medium text-white/80 backdrop-blur">
            <span className="relative flex size-2">
              <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative size-2 rounded-full bg-emerald-400" />
            </span>
            4 персоны онлайн
          </span>
        </header>

        {/* Hero */}
        <section className="pt-10 pb-8 sm:pt-16 lg:max-w-3xl">
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease }}
            className="text-xs font-semibold tracking-[0.2em] text-muted uppercase"
          >
            AI-блогеры нового поколения
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="mt-4 font-display text-[40px] leading-[1.02] font-semibold tracking-tight sm:text-6xl"
          >
            Живые истории.{" "}
            <span className="bg-gradient-to-r from-[#B79CFF] via-[#FF5C8A] to-[#5CE1E6] bg-clip-text text-transparent">
              Только не совсем люди.
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease }}
            className="mt-5 max-w-md text-[17px] leading-relaxed text-white/70"
          >
            Четыре AI-персонажа ведут блоги, делятся жизнью и отвечают в личке. Выбери, с кем хочешь
            познакомиться.
          </motion.p>

          {/* Сторис-кружки: самый быстрый вход в профиль */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
            className="no-scrollbar -mx-4 mt-6 -mb-2 flex gap-4 overflow-x-auto px-4 py-2 sm:mx-0 sm:px-1"
          >
            {bloggers.map((b) => (
              <motion.button
                key={b.id}
                type="button"
                variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                whileTap={{ scale: 0.92 }}
                onClick={() => {
                  haptic("light");
                  openBlogger(b.id, "chat");
                }}
                className="flex w-[72px] shrink-0 flex-col items-center gap-2"
                aria-label={`Написать ${b.nameDative}`}
              >
                <span className="relative flex size-[72px] items-center justify-center">
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full will-change-transform animate-[ring-spin_6s_linear_infinite]"
                    style={{ background: `conic-gradient(${b.accent}, transparent 60%, ${b.accent})` }}
                  />
                  <span className="relative size-[66px] overflow-hidden rounded-full border-[3px] border-bg">
                    <Image src={b.avatar} alt="" fill sizes="66px" className="object-cover" />
                  </span>
                  <span className="absolute right-0.5 bottom-0.5 size-3.5 rounded-full border-[3px] border-bg bg-emerald-400" />
                </span>
                <span className="text-xs font-medium text-white/80">{b.name.split(" ")[0]}</span>
              </motion.button>
            ))}
          </motion.div>
        </section>

        {/* Каталог */}
        <section id="catalog" aria-labelledby="catalog-title" className="pt-4">
          <div className="mb-5 flex items-end justify-between">
            <h2 id="catalog-title" className="font-display text-2xl font-semibold tracking-tight">
              Персонажи
            </h2>
            <span className="text-sm text-muted">2 ♀ · 2 ♂</span>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {bloggers.map((b, i) => (
              <BloggerCard key={b.id} blogger={b} index={i} onOpen={(id) => openBlogger(id)} />
            ))}
          </div>
        </section>

        {/* Как это работает */}
        <section aria-labelledby="how-title" className="pt-16">
          <h2 id="how-title" className="font-display text-2xl font-semibold tracking-tight">
            Как это работает
          </h2>
          <ol className="mt-6 grid gap-3 sm:grid-cols-3">
            {steps.map((s, i) => (
              <motion.li
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.08, ease }}
                className="rounded-3xl border border-line bg-white/[0.03] p-5"
              >
                <span className="font-display text-sm font-semibold text-muted">0{i + 1}</span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-1.5 text-[15px] leading-relaxed text-white/65">{s.text}</p>
              </motion.li>
            ))}
          </ol>
        </section>

        {/* Финальный CTA */}
        <section ref={finalRef} className="pt-16">
          <div className="relative overflow-hidden rounded-[32px] border border-line bg-surface p-6 sm:p-10">
            {/* Радиальный градиент вместо blur: iOS Safari обрезает blur внутри overflow-hidden прямоугольником */}
            <div
              aria-hidden
              className="absolute -top-32 -right-32 size-96"
              style={{ background: "radial-gradient(closest-side, rgba(42,171,238,0.28), transparent)" }}
            />
            <div className="flex -space-x-3">
              {bloggers.map((b) => (
                <span key={b.id} className="relative size-11 overflow-hidden rounded-full border-2 border-surface">
                  <Image src={b.avatar} alt="" fill sizes="44px" className="object-cover" />
                </span>
              ))}
            </div>
            <h2 className="relative mt-5 max-w-md font-display text-[26px] leading-tight font-semibold tracking-tight sm:text-4xl">
              Продолжим общение в Telegram
            </h2>
            <p className="relative mt-3 max-w-md text-[15px] leading-relaxed text-white/70">
              Персонажи пишут первыми, помнят ваши разговоры и делятся тем, что не попадает в ленту.
            </p>
            <div className="relative mt-6 max-w-sm">
              <TelegramButton />
            </div>
          </div>
        </section>

        <footer className="pt-10 text-center text-xs leading-relaxed text-muted">
          Все персонажи MIRRA созданы искусственным интеллектом.
          <br />
          Совпадения с реальными людьми случайны.
        </footer>
      </motion.main>
      </div>

      {/* Липкий CTA в зоне большого пальца */}
      <StickyCta enabled={showSticky} />

      <AnimatePresence>
        {open && (
          <ProfileSheet
            key="sheet"
            bloggers={bloggers}
            index={open.index}
            initialTab={open.tab}
            onIndexChange={(index) => setOpen((o) => (o ? { ...o, index } : o))}
            onClose={close}
          />
        )}
      </AnimatePresence>
    </MotionConfig>
  );
}
