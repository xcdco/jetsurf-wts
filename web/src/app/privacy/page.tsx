import type { Metadata } from "next";
import Link from "next/link";
import { business, siteUrl } from "@/lib/seo-config";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Как мы обрабатываем персональные данные заявок на аренду джетсёрфа в Севастополе и Крыму.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-sand-50 px-4 py-16 text-ocean-950 sm:px-6">
      <article className="mx-auto max-w-2xl rounded-3xl border border-ocean-900/10 bg-white p-8 shadow-sm">
        <p className="text-sm text-ocean-600">
          <Link href="/" className="font-medium underline underline-offset-4">
            ← На главную
          </Link>
        </p>
        <h1 className="font-display mt-6 text-3xl font-semibold">
          Политика конфиденциальности
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-ocean-900/80">
          Настоящая политика описывает базовый порядок обработки данных для заявок
          на сайте {siteUrl.replace(/^https?:\/\//, "")} ({business.name}). Замените
          этот текст на юридически выверенный документ вашего юриста с реквизитами
          оператора персональных данных.
        </p>
        <ul className="mt-6 list-disc space-y-2 pl-5 text-sm text-ocean-900/80">
          <li>Мы используем контакты только для связи по брони и уточнения слота.</li>
          <li>Данные не передаём третьим лицам без оснований, кроме интеграций (CRM/мессенджеры), указанных вами при настройке.</li>
          <li>Вы можете запросить удаление заявки, написав на {business.email}.</li>
        </ul>
      </article>
    </div>
  );
}
