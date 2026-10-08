import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import { TelegramInit } from "@/components/telegram-init";
import "./globals.css";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "600", "700"],
});

const onest = Onest({
  variable: "--font-onest",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "MIRRA — AI-блогеры, с которыми можно поговорить",
  description:
    "Четыре AI-персонажа ведут блоги, делятся историями и отвечают в личке. Выбери своего и продолжи общение в Telegram.",
  openGraph: {
    title: "MIRRA — AI-блогеры",
    description: "Живые истории. Только не совсем люди.",
    type: "website",
    locale: "ru_RU",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A0A0C",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable} antialiased`}>
      <body className="grain">
        {children}
        <TelegramInit />
      </body>
    </html>
  );
}
