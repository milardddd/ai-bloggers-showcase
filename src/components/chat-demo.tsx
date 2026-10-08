"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Blogger, ChatOption } from "@/data/bloggers";
import { haptic } from "@/lib/telegram";

type Message = { id: number; from: "bot" | "user"; text: string };

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const typingDelay = (text: string) => Math.min(1700, 550 + text.length * 16);

export function ChatDemo({ blogger, onFinish }: { blogger: Blogger; onFinish: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typing, setTyping] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(true);
  const [finished, setFinished] = useState(false);
  const idRef = useRef(0);
  const alive = useRef(true);
  const endRef = useRef<HTMLDivElement>(null);
  // Автоскролл только после первого ответа пользователя — не уводим его от профиля при открытии
  const interacted = useRef(false);

  const say = useCallback(async (texts: string[]) => {
    setBusy(true);
    for (const text of texts) {
      setTyping(true);
      await sleep(typingDelay(text));
      if (!alive.current) return;
      setTyping(false);
      setMessages((m) => [...m, { id: ++idRef.current, from: "bot", text }]);
      haptic("selection");
      await sleep(250);
      if (!alive.current) return;
    }
    setBusy(false);
  }, []);

  useEffect(() => {
    alive.current = true;
    const t = setTimeout(() => say(blogger.chat.greeting), 350);
    return () => {
      alive.current = false;
      clearTimeout(t);
    };
  }, [blogger, say]);

  useEffect(() => {
    if (!interacted.current) return;
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, busy]);

  const pick = async (option: ChatOption) => {
    haptic("light");
    interacted.current = true;
    setMessages((m) => [...m, { id: ++idRef.current, from: "user", text: option.label }]);
    const next = step + 1;
    setStep(next);
    await sleep(300);
    await say(option.reply);
    if (next >= blogger.chat.steps.length && alive.current) {
      await sleep(400);
      await say(blogger.chat.outro);
      if (alive.current) {
        setFinished(true);
        onFinish();
      }
    }
  };

  const options = blogger.chat.steps[step];

  return (
    <div className="flex flex-col gap-2 px-4 pt-2 pb-4">
      <p className="mb-2 text-center text-xs text-muted">
        Демо-диалог · полная версия с памятью — в Telegram
      </p>

      <div className="contents" aria-live="polite">
      <AnimatePresence initial={false}>
        {messages.map((msg, i) => {
          const isBot = msg.from === "bot";
          const showAvatar = isBot && messages[i + 1]?.from !== "bot" && !(typing && i === messages.length - 1);
          return (
            <motion.div
              key={msg.id}
              layout="position"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={`flex items-end gap-2 ${isBot ? "justify-start" : "justify-end"}`}
            >
              {isBot && (
                <div className="relative size-7 shrink-0 overflow-hidden rounded-full">
                  {showAvatar && (
                    <Image src={blogger.portrait} alt="" fill sizes="28px" className="object-cover object-top" />
                  )}
                </div>
              )}
              <div
                className={`max-w-[78%] rounded-[20px] px-3.5 py-2.5 text-[15px] leading-snug ${
                  isBot ? "rounded-bl-md bg-surface-2 text-ink" : "rounded-br-md font-medium text-black"
                }`}
                style={isBot ? undefined : { background: blogger.accent }}
              >
                {msg.text}
              </div>
            </motion.div>
          );
        })}

        {typing && (
          <motion.div
            key="typing"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-end gap-2"
          >
            <div className="relative size-7 shrink-0 overflow-hidden rounded-full">
              <Image src={blogger.portrait} alt="" fill sizes="28px" className="object-cover object-top" />
            </div>
            <div className="flex gap-1 rounded-[20px] rounded-bl-md bg-surface-2 px-4 py-3.5" role="status" aria-label={`${blogger.name.split(" ")[0]} печатает`}>
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="size-1.5 rounded-full bg-white/60 animate-[typing_0.9s_ease-in-out_infinite]"
                  style={{ animationDelay: `${d * 0.15}s` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      <AnimatePresence mode="wait">
        {!busy && options && (
          <motion.div
            key={`step-${step}`}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: 8, transition: { duration: 0.15 } }}
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            className="mt-3 flex flex-col items-end gap-2"
          >
            {options.map((option) => (
              <motion.button
                key={option.label}
                type="button"
                variants={{ hidden: { opacity: 0, x: 16 }, show: { opacity: 1, x: 0 } }}
                whileTap={{ scale: 0.96 }}
                onClick={() => pick(option)}
                className="min-h-11 rounded-full border px-4 py-2 text-left text-[15px] font-medium"
                style={{ borderColor: `${blogger.accent}66`, color: blogger.accent }}
              >
                {option.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        {finished && (
          <motion.p
            key="cta"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-sm text-white/60"
          >
            {blogger.name.split(" ")[0]} ждёт тебя в Telegram: личные ответы, память о разговорах и
            истории, которых нет здесь ↓
          </motion.p>
        )}
      </AnimatePresence>

      <div ref={endRef} className="h-1 scroll-mb-[calc(var(--safe-bottom)+88px)]" />
    </div>
  );
}
