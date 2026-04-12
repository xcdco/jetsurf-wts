"use client";

import Image from "next/image";
import Link from "next/link";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, useReducedMotion } from "framer-motion";

const heroImage =
  "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=1920&q=85&auto=format&fit=crop";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useLayoutEffect(() => {
    if (reduce || !root.current || !bg.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bg.current,
        { scale: 1.12 },
        { scale: 1, duration: 1.35, ease: "power2.out" },
      );
      gsap.to(bg.current, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, root);
    return () => ctx.revert();
  }, [reduce]);

  return (
    <section
      ref={root}
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden bg-ocean-950"
    >
      <div ref={bg} className="hero-bg absolute inset-0">
        <Image
          src={heroImage}
          alt="Катание на джетсёрфе в Крыму — бирюзовая вода и солнечный день"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-ocean-950/55 via-ocean-900/45 to-ocean-950"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,rgba(94,225,211,0.22),transparent_55%)]"
          aria-hidden
        />
      </div>

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end gap-10 px-4 pb-16 pt-28 sm:px-6 sm:pb-20 sm:pt-32 lg:flex-row lg:items-end lg:justify-between lg:pb-24">
        <div className="max-w-xl lg:max-w-lg">
          <motion.p
            className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-aqua-300/90"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
          >
            Севастополь · Крым
          </motion.p>
          <motion.h1
            className="font-display text-balance text-4xl font-semibold leading-[1.05] text-white sm:text-5xl lg:text-6xl"
            initial={reduce ? false : { opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="gradient-ocean-text">Скорость.</span> Свобода.{" "}
            <span className="text-white">Вода под ногами.</span>
          </motion.h1>
          <motion.p
            className="mt-5 max-w-md text-pretty text-base leading-relaxed text-white/80 sm:text-lg"
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            Аренда джетсёрфа в Севастополе: инструктаж, экипировка и безопасный
            выход на воду. Прокат jet surf в Крыму — для туристов, пар и компаний.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="#contact"
              className="focus-ring inline-flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-sun-500 to-sun-400 px-8 text-base font-semibold text-ocean-950 shadow-[0_18px_50px_rgba(255,159,28,0.35)] transition hover:brightness-105"
            >
              Забронировать слот
            </Link>
            <Link
              href="#models"
              className="focus-ring inline-flex h-12 items-center justify-center rounded-full border border-white/25 bg-white/5 px-8 text-base font-semibold text-white backdrop-blur-sm transition hover:border-aqua-400/50 hover:bg-white/10"
            >
              Смотреть модели
            </Link>
          </motion.div>
          <motion.p
            className="mt-6 text-sm text-white/55"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            Ответим в Telegram / WhatsApp в день обращения
          </motion.p>
        </div>

        <motion.div
          ref={fg}
          className="relative mx-auto w-full max-w-md lg:mx-0 lg:max-w-lg"
          initial={reduce ? false : { opacity: 0, y: 40, rotate: -2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 18,
            delay: 0.2,
          }}
        >
          <div className="glass-panel relative overflow-hidden rounded-3xl p-1 shadow-[0_40px_120px_rgba(0,0,0,0.45)]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.35rem] sm:aspect-[16/11]">
              <Image
                src="https://i.imgur.com/EYSNOHh.jpeg"
                alt="JetSurf на Чёрном море — аренда в Севастополе"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 480px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-aqua-300/90">
                    Премиум-опыт
                  </p>
                  <p className="font-display text-lg font-semibold text-white">
                    JetSurf на Чёрном море
                  </p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  JetSurf + SUP
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
