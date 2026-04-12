import Link from "next/link";
import { business } from "@/lib/seo-config";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ocean-950 px-4 py-12 text-white sm:px-6">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-display text-lg font-semibold">
            JetSurf<span className="text-aqua-400">.</span>Крым
          </p>
          <p className="mt-2 max-w-sm text-sm text-white/65">
            Аренда джетсёрфа в Севастополе и Крыму: инструктаж, экипировка и
            поддержка по брони.{" "}
            <Link
              href="#models"
              className="text-aqua-300 underline decoration-white/20 underline-offset-4 hover:decoration-aqua-300"
            >
              Смотреть модели
            </Link>
            .
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              Связь
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a className="text-white/80 hover:text-white" href={`tel:${business.phoneTel}`}>
                  {business.phone}
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-white"
                  href={business.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Telegram
                </a>
              </li>
              <li>
                <a
                  className="text-white/80 hover:text-white"
                  href={business.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-white/45">
              Навигация
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link className="text-white/80 hover:text-white" href="#services">
                  Услуги
                </Link>
              </li>
              <li>
                <Link className="text-white/80 hover:text-white" href="#included">
                  Комплектация
                </Link>
              </li>
              <li>
                <Link className="text-white/80 hover:text-white" href="#rental-terms">
                  Условия и договор
                </Link>
              </li>
              <li>
                <Link className="text-white/80 hover:text-white" href="#steps">
                  Как это работает
                </Link>
              </li>
              <li>
                <Link className="text-white/80 hover:text-white" href="#reviews">
                  Отзывы
                </Link>
              </li>
              <li>
                <Link className="text-white/80 hover:text-white" href="#pricing">
                  Цены и пакеты
                </Link>
              </li>
              <li>
                <Link className="text-white/80 hover:text-white" href="#faq">
                  Вопросы и ответы
                </Link>
              </li>
              <li>
                <Link className="text-white/80 hover:text-white" href="/privacy">
                  Политика конфиденциальности
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 flex max-w-6xl flex-col gap-2 border-t border-white/10 pt-8 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} {business.name}. Все права защищены.</p>
        <p className="text-white/35">
          Соцсети: Instagram · YouTube — замените ссылки в коде на ваши реальные.
        </p>
      </div>
    </footer>
  );
}
