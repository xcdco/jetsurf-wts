"use client";

import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  filterTabs,
  jetModels,
  supModels,
  type CatalogFilter,
} from "@/lib/models-data";

const JET_SLIDE_MS = 5000;

/** Раскрываемый блок характеристики SUP: длинные подписи и текст не обрезаются навсегда */
function ExpandableSpecRow({ label, value }: { label: string; value: string }) {
  return (
    <details className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 [&>summary::-webkit-details-marker]:hidden">
      <summary className="focus-ring cursor-pointer list-none px-3 py-2 transition hover:bg-white/[0.07]">
        <p className="break-words text-sm leading-snug text-white/50">{label}</p>
        <p className="mt-1 line-clamp-2 break-words text-sm font-medium leading-snug text-white">
          {value}
        </p>
        <p className="mt-1.5 text-xs text-white/40">Нажмите, чтобы прочитать полностью</p>
      </summary>
      <div className="border-t border-white/10 px-3 py-2.5 text-sm font-medium leading-relaxed text-white/90 [overflow-wrap:anywhere]">
        {value}
      </div>
    </details>
  );
}

function JetSlideShow({ images, alt }: { images: string[]; alt: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % images.length),
      JET_SLIDE_MS,
    );
    return () => window.clearInterval(id);
  }, [images.length]);

  return (
    <div className="relative aspect-[16/11] overflow-hidden">
      {images.map((src, i) => (
        <Image
          key={src}
          src={src}
          alt={i === index ? alt : ""}
          fill
          className={`object-cover transition-opacity duration-[900ms] ease-in-out ${
            i === index ? "z-[1] opacity-100" : "z-0 opacity-0"
          }`}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading="lazy"
        />
      ))}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-ocean-950 via-ocean-950/20 to-transparent" />
    </div>
  );
}

export function ModelCatalog() {
  const [tab, setTab] = useState<CatalogFilter>("all");
  const reduce = useReducedMotion();

  const list = useMemo(() => {
    if (tab === "all") return { jets: jetModels, sups: supModels };
    if (tab === "sup") return { jets: [], sups: supModels };
    return { jets: jetModels, sups: [] };
  }, [tab]);

  const jetList = list.jets;
  const supList = list.sups;
  const isEmpty = jetList.length === 0 && supList.length === 0;

  return (
    <section
      id="models"
      className="scroll-mt-24 bg-ocean-950 px-4 py-20 text-white sm:px-6 sm:py-28"
      aria-labelledby="models-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua-300/90">
            Каталог
          </p>
          <h2
            id="models-heading"
            className="font-display mt-3 max-w-3xl text-balance text-3xl font-semibold sm:text-4xl"
          >
            JetSurf и сапборды: подберём формат под вас
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-white/70">
            Вкладки «Все», «Сапборды» и «Джетсёрфы»: надувной SUP от часа (можно на
            сутки), сап с мотором и JetSurf. Цены ориентировочные — уточним при брони
            в Севастополе и по Крыму.
          </p>
        </motion.div>

        <LayoutGroup>
          <div
            className="mt-10 flex flex-nowrap gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="tablist"
            aria-label="Фильтр каталога"
          >
            {filterTabs.map((t) => {
              const active = tab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(t.id)}
                  className={`focus-ring relative shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "text-ocean-950"
                      : "text-white/75 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="tab-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-aqua-400 to-aqua-300 shadow-[0_10px_40px_rgba(94,225,211,0.35)]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>

          <motion.div
            layout
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {!isEmpty &&
                jetList.map((m) => (
                  <motion.article
                    key={m.id}
                    layout
                    initial={
                      reduce ? undefined : { opacity: 0, y: 22, scale: 0.98 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                    }}
                    whileHover={
                      reduce
                        ? undefined
                        : {
                            y: -6,
                            rotateX: 1.5,
                            rotateY: -1.5,
                            transition: {
                              type: "spring",
                              stiffness: 320,
                              damping: 22,
                            },
                          }
                    }
                    style={{ transformStyle: "preserve-3d" }}
                    className="group relative w-full min-w-0 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute -inset-24 bg-[radial-gradient(circle_at_30%_20%,rgba(94,225,211,0.22),transparent_45%)]" />
                    </div>
                    <div className="relative overflow-hidden transition-transform duration-700 ease-out group-hover:scale-[1.03]">
                      <JetSlideShow images={m.images} alt={m.imageAlt} />
                    </div>
                    <div className="relative space-y-4 p-6 sm:p-7">
                      <div>
                        <h3 className="font-display text-xl font-semibold">
                          {m.name}
                        </h3>
                        <p className="mt-1 text-sm text-white/65">{m.tagline}</p>
                      </div>
                      <dl className="grid grid-cols-2 gap-3 text-sm">
                        <div className="rounded-xl bg-white/5 px-3 py-2">
                          <dt className="text-white/50">Мощность</dt>
                          <dd className="font-medium">{m.power}</dd>
                        </div>
                        <div className="rounded-xl bg-white/5 px-3 py-2">
                          <dt className="text-white/50">Скорость</dt>
                          <dd className="font-medium">{m.speed}</dd>
                        </div>
                        <div className="rounded-xl bg-white/5 px-3 py-2">
                          <dt className="text-white/50">Аренда</dt>
                          <dd className="font-medium">{m.duration}</dd>
                        </div>
                        <div className="rounded-xl bg-white/5 px-3 py-2">
                          <dt className="text-white/50">От</dt>
                          <dd className="font-semibold text-aqua-300">
                            {m.priceFrom.toLocaleString("ru-RU")} {m.currency}
                          </dd>
                        </div>
                      </dl>
                      <Link
                        href="#contact"
                        className="focus-ring inline-flex w-full items-center justify-center rounded-full bg-white/10 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
                      >
                        Забронировать эту модель
                      </Link>
                    </div>
                  </motion.article>
                ))}

              {!isEmpty &&
                supList.map((s) => (
                  <motion.article
                    key={s.id}
                    layout
                    initial={
                      reduce ? undefined : { opacity: 0, y: 22, scale: 0.98 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 26,
                    }}
                    whileHover={
                      reduce
                        ? undefined
                        : {
                            y: -6,
                            transition: { type: "spring", stiffness: 320, damping: 22 },
                          }
                    }
                    className="group relative w-full min-w-0 overflow-hidden rounded-3xl border border-sun-400/25 bg-white/[0.06] shadow-[0_30px_90px_rgba(0,0,0,0.35)]"
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <div className="absolute -inset-24 bg-[radial-gradient(circle_at_70%_20%,rgba(255,180,71,0.15),transparent_50%)]" />
                    </div>
                    <div className="relative aspect-[16/11] overflow-hidden">
                      <Image
                        src={s.image}
                        alt={s.imageAlt}
                        title={`${s.name} — прокат SUP в Крыму`}
                        fill
                        className="object-cover transition duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/25 to-transparent" />
                      <span className="absolute right-4 top-4 rounded-full bg-sun-500/90 px-3 py-1 text-xs font-bold text-ocean-950">
                        SUP
                      </span>
                    </div>
                    <div className="relative space-y-4 p-6 sm:p-7">
                      <div>
                        <h3 className="font-display text-xl font-semibold">
                          {s.name}
                        </h3>
                        <p className="mt-1 text-sm text-white/65">{s.tagline}</p>
                      </div>
                      <div className="flex flex-col gap-3 text-sm">
                        <ExpandableSpecRow label={s.row1Label} value={s.row1Value} />
                        <ExpandableSpecRow label={s.row2Label} value={s.row2Value} />
                        <div className="min-w-0 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                          <p className="break-words text-sm text-white/50">Цена</p>
                          <p className="mt-1 break-words text-sm font-semibold leading-snug text-sun-400">
                            {s.pricePerHour.toLocaleString("ru-RU")} {s.currency}
                            /час
                          </p>
                        </div>
                      </div>
                      {s.bonus && (
                        <p className="rounded-xl border border-sun-400/20 bg-sun-400/10 px-3 py-2 text-xs leading-relaxed text-white/90">
                          {s.bonus}
                        </p>
                      )}
                      <Link
                        href="#contact"
                        className="focus-ring inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-sun-500 to-sun-400 py-3 text-sm font-semibold text-ocean-950 transition hover:brightness-105"
                      >
                        Забронировать SUP
                      </Link>
                    </div>
                  </motion.article>
                ))}
            </AnimatePresence>
          </motion.div>

          {isEmpty && (
            <p className="mt-8 text-center text-sm text-white/60">
              В этой категории сейчас нет позиций — откройте «Все», «Сапборды» или
              «Джетсёрфы».
            </p>
          )}
        </LayoutGroup>
      </div>
    </section>
  );
}
