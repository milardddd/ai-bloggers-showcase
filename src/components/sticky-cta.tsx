"use client";

import { motion } from "motion/react";
import { TelegramButton } from "./telegram-button";

/**
 * Плавающая CTA в зоне большого пальца, без подложки.
 * Всегда на месте; прячется только когда открыт профиль или виден финальный CTA-блок.
 */
export function StickyCta({ enabled }: { enabled: boolean }) {
  return (
    <motion.div
      initial={false}
      animate={enabled ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
      transition={{ type: "spring", stiffness: 380, damping: 38, opacity: { duration: 0.18 } }}
      aria-hidden={!enabled}
      className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--safe-bottom)+12px)] z-40 px-4"
    >
      <div className={`mx-auto max-w-md ${enabled ? "pointer-events-auto" : ""}`}>
        <TelegramButton className="shadow-none!" />
      </div>
    </motion.div>
  );
}
