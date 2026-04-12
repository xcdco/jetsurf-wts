"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { business } from "@/lib/seo-config";
import { leadSchema, type LeadPayload } from "@/lib/lead-schema";
import { submitLead } from "@/lib/submit-lead";

const packageLabels: Record<string, string> = {
  p30: "Пакет «Старт» 30 мин",
  p60: "Пакет «Хит сезона» 60 мин",
  p90: "Пакет «Максимум» 90 мин",
  p24: "Суточный тариф JET SURF",
};

export function Contact() {
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle");
  const [pkgHint, setPkgHint] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LeadPayload>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      rideDate: "",
      comment: "",
      packageId: "",
    },
  });

  useEffect(() => {
    const id = sessionStorage.getItem("selectedPackage");
    if (id) {
      setValue("packageId", id);
      setPkgHint(packageLabels[id] ?? null);
      sessionStorage.removeItem("selectedPackage");
    }
  }, [setValue]);

  async function onSubmit(data: LeadPayload) {
    setStatus("idle");
    try {
      await submitLead(data);
      setStatus("ok");
      reset();
      setPkgHint(null);
    } catch {
      setStatus("err");
    }
  }

  const { lat, lng } = business.geo;
  const mapSrc = `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdm`;

  return (
    <section
      id="contact"
      className="scroll-mt-24 border-t border-ocean-900/10 bg-gradient-to-b from-white to-sand-50 px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-600">
            Контакты
          </p>
          <h2
            id="contact-heading"
            className="font-display mt-3 text-balance text-3xl font-semibold text-ocean-950 sm:text-4xl"
          >
            Забронируйте катание на джетсёрфе в Севастополе
          </h2>
          <p className="mt-4 text-pretty text-ocean-900/75">
            Оставьте заявку — подтвердим время, модель и детали проката jet surf в
            Крыму. Ответим в мессенджерах в день обращения.
          </p>

          <ul className="mt-8 space-y-4 text-sm">
            <li>
              <span className="text-ocean-900/55">Телефон</span>
              <br />
              <a
                className="font-semibold text-ocean-800 hover:text-ocean-600"
                href={`tel:${business.phoneTel}`}
              >
                {business.phone}
              </a>
            </li>
            <li>
              <span className="text-ocean-900/55">Мессенджеры</span>
              <br />
              <a
                className="mr-3 font-medium text-ocean-700 underline decoration-aqua-400/50 underline-offset-4 hover:text-ocean-600"
                href={business.telegram}
                target="_blank"
                rel="noopener noreferrer"
              >
                Telegram
              </a>
              <a
                className="font-medium text-ocean-700 underline decoration-aqua-400/50 underline-offset-4 hover:text-ocean-600"
                href={business.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <span className="text-ocean-900/55">Локация</span>
              <br />
              <span className="text-ocean-900/85">{business.address.streetAddress}</span>
              <br />
              <span className="text-ocean-900/85">
                {business.address.addressLocality}, {business.address.addressRegion}
              </span>
            </li>
          </ul>

          <div className="mt-8 overflow-hidden rounded-2xl border border-ocean-900/10 shadow-inner">
            <iframe
              title="Карта: точка проката в Севастополе"
              src={mapSrc}
              className="aspect-[4/3] h-56 w-full bg-ocean-900/5 sm:h-64"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-3 text-sm">
            <a
              className="font-medium text-ocean-700 underline decoration-aqua-400/50 underline-offset-4 hover:text-ocean-600"
              href={business.yandexMapsRouteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Построить маршрут в Яндекс.Картах
            </a>
            <span className="text-ocean-900/50"> · </span>
            <a
              className="font-medium text-ocean-700 underline decoration-aqua-400/50 underline-offset-4 hover:text-ocean-600"
              href={business.yandexMapsPointUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              Координаты на карте
            </a>
          </p>
        </div>

        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-3xl border border-ocean-900/10 bg-white p-6 shadow-[0_24px_80px_rgba(6,42,56,0.08)] sm:p-8"
            noValidate
          >
            {pkgHint && (
              <p className="mb-4 rounded-xl bg-aqua-300/20 px-4 py-2 text-sm text-ocean-900">
                Выбрано: <strong>{pkgHint}</strong>
              </p>
            )}
            <input type="hidden" {...register("packageId")} />

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-ocean-950" htmlFor="name">
                  Имя
                </label>
                <input
                  id="name"
                  className="focus-ring mt-2 w-full rounded-xl border border-ocean-900/15 bg-sand-50 px-4 py-3 text-ocean-950 outline-none transition focus:border-aqua-400/60"
                  placeholder="Как к вам обращаться"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-medium text-ocean-950" htmlFor="phone">
                  Телефон
                </label>
                <input
                  id="phone"
                  inputMode="tel"
                  className="focus-ring mt-2 w-full rounded-xl border border-ocean-900/15 bg-sand-50 px-4 py-3 text-ocean-950 outline-none transition focus:border-aqua-400/60"
                  placeholder="+7 (___) ___-__-__"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>
              <div>
                <label
                  className="text-sm font-medium text-ocean-950"
                  htmlFor="rideDate"
                >
                  Дата катания
                </label>
                <input
                  id="rideDate"
                  type="date"
                  className="focus-ring mt-2 w-full rounded-xl border border-ocean-900/15 bg-sand-50 px-4 py-3 text-ocean-950 outline-none transition focus:border-aqua-400/60"
                  {...register("rideDate")}
                />
                {errors.rideDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.rideDate.message}
                  </p>
                )}
              </div>
              <div className="sm:col-span-2">
                <label
                  className="text-sm font-medium text-ocean-950"
                  htmlFor="comment"
                >
                  Комментарий
                </label>
                <textarea
                  id="comment"
                  rows={4}
                  className="focus-ring mt-2 w-full resize-y rounded-xl border border-ocean-900/15 bg-sand-50 px-4 py-3 text-ocean-950 outline-none transition focus:border-aqua-400/60"
                  placeholder="Уровень, желаемое время, количество человек"
                  {...register("comment")}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="focus-ring mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-ocean-600 to-ocean-500 text-sm font-semibold text-white shadow-[0_16px_50px_rgba(15,111,143,0.35)] transition hover:brightness-105 disabled:opacity-60"
            >
              {isSubmitting ? "Отправляем…" : "Отправить заявку"}
            </button>

            {status === "ok" && (
              <p className="mt-4 text-center text-sm font-medium text-ocean-700">
                Заявка отправлена. Скоро свяжемся!
              </p>
            )}
            {status === "err" && (
              <p className="mt-4 text-center text-sm font-medium text-red-600">
                Не удалось отправить. Попробуйте позже или напишите в Telegram.
              </p>
            )}

            <p className="mt-4 text-center text-xs text-ocean-900/50">
              Нажимая кнопку, вы соглашаетесь с{" "}
              <a className="underline" href="/privacy">
                политикой конфиденциальности
              </a>
              .
            </p>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
