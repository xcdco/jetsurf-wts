"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

type Pack = {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  perks: string[];
  note: string;
  popular?: boolean;
};

const packs: Pack[] = [
  {
    id: "p30",
    name: "Старт",
    subtitle: "30 минут на воде",
    price: "4 500 ₽",
    perks: ["Инструктаж", "Экипировка", "Поддержка на связи", "Доска JetSurf"],
    note: "Идеально познакомиться с доской",
  },
  {
    id: "p60",
    name: "Хит сезона",
    subtitle: "60 минут на воде",
    price: "8 900 ₽",
    perks: [
      "Всё из «Старт»",
      "Больше времени на прогресс",
      "Смена режима под задачу",
      "Приоритет по слоту",
    ],
    popular: true,
    note: "Самый частый выбор туристов в Крыму",
  },
  {
    id: "p90",
    name: "Максимум",
    subtitle: "90 минут на воде",
    price: "13 500 ₽",
    perks: [
      "Всё из «Хит сезона»",
      "Расширенная сессия",
      "Фото (по запросу)",
      "Советы по технике",
    ],
    note: "Для компаний и любителей драйва",
  },
  {
    id: "p24",
    name: "Суточный тариф",
    subtitle: "Аренда JET SURF на сутки",
    price: "19 900 ₽",
    perks: ["Jet surf", "АКБ + зарядка", "Спасательный жилет + шлем"],
    note: "Полный комплект на день — уточним выдачу и заряд при брони",
  },
];

export function Pricing() {
  const reduce = useReducedMotion();

  return (
    <section
      id="pricing"
      className="scroll-mt-24 bg-gradient-to-b from-sand-50 to-white px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="pricing-heading"
    >
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-600">
            Пакеты
          </p>
          <h2
            id="pricing-heading"
            className="font-display mt-3 max-w-3xl text-balance text-3xl font-semibold text-ocean-950 sm:text-4xl"
          >
            Цены на аренду джетсёрфа: 30, 60, 90 минут и сутки
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-ocean-900/75">
            Прозрачное сравнение: что входит в каждый пакет. Суточный тариф — для
            тех, кто хочет JET SURF на целый день. Итоговую сумму подтвердим перед
            выходом на воду. Аренда{" "}
            <a
              href="#models"
              className="font-medium text-ocean-600 underline decoration-aqua-400/60 underline-offset-4 hover:text-ocean-800"
            >
              сапбордов
            </a>{" "}
            — почасово в каталоге.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {packs.map((p, i) => (
            <motion.article
              key={p.id}
              initial={reduce ? false : { opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                delay: i * 0.06,
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={
                reduce ? undefined : { y: -4, transition: { duration: 0.25 } }
              }
              className={`relative flex h-full flex-col rounded-3xl border p-7 ${
                p.popular
                  ? "border-aqua-400/60 bg-ocean-950 text-white shadow-[0_30px_90px_rgba(6,42,56,0.35)]"
                  : "border-ocean-900/10 bg-white shadow-[0_20px_70px_rgba(6,42,56,0.08)]"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-sun-500 to-sun-400 px-4 py-1 text-xs font-bold text-ocean-950 shadow-lg">
                  Популярный
                </span>
              )}
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <p
                className={`mt-1 text-sm ${p.popular ? "text-white/70" : "text-ocean-900/65"}`}
              >
                {p.subtitle}
              </p>
              <p
                className={`mt-6 font-display text-4xl font-semibold ${p.popular ? "text-aqua-300" : "text-ocean-950"}`}
              >
                {p.price}
              </p>
              <p
                className={`mt-2 text-sm ${p.popular ? "text-white/65" : "text-ocean-900/65"}`}
              >
                {p.note}
              </p>
              <ul
                className={`mt-6 flex-1 space-y-2 text-sm ${p.popular ? "text-white/85" : "text-ocean-900/80"}`}
              >
                {p.perks.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${p.popular ? "bg-aqua-400" : "bg-ocean-500"}`}
                    />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/#contact"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    sessionStorage.setItem("selectedPackage", p.id);
                  }
                }}
                className={`focus-ring mt-8 inline-flex h-12 items-center justify-center rounded-full text-center text-sm font-semibold transition ${
                  p.popular
                    ? "bg-gradient-to-r from-aqua-400 to-aqua-300 text-ocean-950 hover:brightness-105"
                    : "bg-ocean-950 text-white hover:bg-ocean-900"
                }`}
              >
                Выбрать пакет
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
