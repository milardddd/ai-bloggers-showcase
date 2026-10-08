"use client";

import { useSyncExternalStore } from "react";
import { buildTelegramUrl, readUtm, type Utm } from "./telegram";

const EMPTY: Utm = {};
let cached: Utm | null = null;

const subscribe = () => () => {};
const getSnapshot = () => (cached ??= readUtm());
const getServerSnapshot = () => EMPTY;

/** Ссылка на бота с id персонажа и UTM текущего визита. На сервере — без UTM. */
export function useTelegramUrl(bloggerId?: string) {
  const utm = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return buildTelegramUrl(bloggerId, utm);
}
