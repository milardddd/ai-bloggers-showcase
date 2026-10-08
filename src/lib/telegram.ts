/** Единая точка правды для ссылки на бота. Поменять username — и всё. */
export const TELEGRAM_BOT_URL = "https://t.me/mirra_ai_bot";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>;

const STORAGE_KEY = "mirra:utm";

/** Читает UTM из URL; если их нет — берёт сохранённые в сессии (first touch внутри сессии). */
export function readUtm(): Utm {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  const fromUrl: Utm = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) fromUrl[key] = value;
  }
  try {
    if (Object.keys(fromUrl).length > 0) {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fromUrl));
      return fromUrl;
    }
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as Utm) : {};
  } catch {
    return fromUrl;
  }
}

const START_SHORT: Record<string, string> = {
  utm_source: "s",
  utm_medium: "m",
  utm_campaign: "c",
  utm_content: "ct",
  utm_term: "t",
};

/**
 * Telegram передаёт боту только параметр `start` (до 64 символов, [A-Za-z0-9_-]).
 * Упаковываем туда id персонажа и UTM: `lina__s-instagram__c-launch`.
 */
export function buildStartPayload(bloggerId: string | undefined, utm: Utm): string {
  const clean = (v: string) => v.replace(/[^A-Za-z0-9-]/g, "-").slice(0, 24);
  const parts = [bloggerId ?? "main"];
  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value) parts.push(`${START_SHORT[key]}-${clean(value)}`);
  }
  return parts.join("__").slice(0, 64);
}

export function buildTelegramUrl(bloggerId: string | undefined, utm: Utm): string {
  const url = new URL(TELEGRAM_BOT_URL);
  url.searchParams.set("start", buildStartPayload(bloggerId, utm));
  // Дублируем UTM как query — их видят редиректоры и сервисы аналитики ссылок.
  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value) url.searchParams.set(key, value);
  }
  return url.toString();
}

type TelegramWebApp = {
  ready: () => void;
  expand: () => void;
  openTelegramLink: (url: string) => void;
  HapticFeedback?: {
    impactOccurred: (style: "light" | "medium" | "heavy" | "rigid" | "soft") => void;
    selectionChanged: () => void;
  };
  BackButton?: {
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  initData: string;
};

export function getWebApp(): TelegramWebApp | undefined {
  if (typeof window === "undefined") return undefined;
  const app = (window as unknown as { Telegram?: { WebApp?: TelegramWebApp } }).Telegram?.WebApp;
  // Скрипт telegram-web-app.js определяет WebApp и вне Telegram, но initData там пустой.
  return app && app.initData ? app : undefined;
}

export function haptic(style: "light" | "medium" | "selection" = "light") {
  const fb = getWebApp()?.HapticFeedback;
  if (!fb) return;
  if (style === "selection") fb.selectionChanged();
  else fb.impactOccurred(style);
}
