"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const primaryNav = [
  { href: "#about", label: "О JetSurf" },
  { href: "#models", label: "Каталог" },
  { href: "#videos", label: "Видео" },
  { href: "#pricing", label: "Цены" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#contact", label: "Контакты" },
];

const moreNav = [
  { href: "#services", label: "Услуги" },
  { href: "#included", label: "Комплектация" },
  { href: "#rental-terms", label: "Условия" },
  { href: "#steps", label: "Как это работает" },
  { href: "#faq", label: "FAQ" },
];

export function Header() {
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 48);
  });

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6"
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border px-3 py-2.5 transition-[background,box-shadow,border-color] duration-300 sm:gap-4 sm:px-4 sm:py-3 ${
            solid
              ? "border-white/15 bg-ocean-950/75 shadow-[0_20px_60px_rgba(3,26,36,0.35)] backdrop-blur-xl"
              : "border-white/10 bg-ocean-950/40 backdrop-blur-md"
          }`}
        >
          <Link
            href="#top"
            className="shrink-0 font-display text-sm font-semibold tracking-tight text-white sm:text-base"
            onClick={() => setMenuOpen(false)}
          >
            JetSurf<span className="text-aqua-400">.</span>Крым
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1"
            aria-label="Основная навигация"
          >
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="focus-ring shrink-0 rounded-full px-2.5 py-1.5 text-sm text-white/85 transition-colors hover:bg-white/10 hover:text-white xl:px-3"
              >
                {item.label}
              </Link>
            ))}
            <div className="relative shrink-0">
              <details className="group relative">
                <summary className="focus-ring list-none cursor-pointer rounded-full px-2.5 py-1.5 text-sm text-white/85 transition-colors marker:content-none hover:bg-white/10 hover:text-white xl:px-3 [&::-webkit-details-marker]:hidden">
                  Ещё
                  <span className="ml-0.5 text-white/50">▾</span>
                </summary>
                <div
                  className="absolute right-0 top-full z-50 mt-2 min-w-[13rem] rounded-2xl border border-white/15 bg-ocean-950/95 py-2 shadow-xl backdrop-blur-xl"
                  role="menu"
                >
                  {moreNav.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block px-4 py-2.5 text-sm text-white/90 transition hover:bg-white/10"
                      role="menuitem"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </details>
            </div>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Link
              href="#models"
              className="focus-ring hidden rounded-full border border-white/20 px-2.5 py-2 text-xs font-medium text-white/90 transition hover:border-aqua-400/50 hover:text-white md:inline-flex md:px-3 md:text-sm"
            >
              Модели
            </Link>
            <Link
              href="#contact"
              className="focus-ring inline-flex items-center justify-center rounded-full bg-gradient-to-r from-aqua-400 to-ocean-500 px-3 py-2 text-xs font-semibold text-ocean-950 shadow-[0_12px_40px_rgba(20,155,184,0.35)] transition hover:brightness-105 sm:px-4 sm:text-sm"
            >
              Забронировать
            </Link>
            <button
              type="button"
              className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span className="sr-only">Меню</span>
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" aria-hidden>
                {menuOpen ? (
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <path
                    d="M5 7h14M5 12h14M5 17h14"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-nav"
            id="mobile-nav"
            className="fixed inset-0 z-40 bg-ocean-950/98 px-6 pb-10 pt-24 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="dialog"
            aria-modal="true"
            aria-label="Навигация по сайту"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMenuOpen(false);
            }}
          >
            <nav className="mx-auto flex max-w-md flex-col gap-1" aria-label="Мобильное меню">
              {[...primaryNav, ...moreNav].map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={item.href}
                    className="block rounded-xl px-4 py-3.5 text-lg font-medium text-white/95 transition hover:bg-white/10"
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
