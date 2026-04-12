import { Reveal } from "./Reveal";

const items = [
  {
    title: "Аренда по времени",
    text: "Слоты от 30 минут: удобно вписаться в отпуск в Крыму и не переплачивать за лишнее.",
  },
  {
    title: "Обучение и инструктаж",
    text: "Спокойно объясняем базу, помогаем с первыми метрами и корректируем стойку.",
  },
  {
    title: "Экипировка",
    text: "Всё необходимое для комфорта и защиты — берёте только настроение и купальник.",
  },
  {
    title: "Фото и видео (опционально)",
    text: "По запросу снимем яркие кадры на память о катании на джетсёрфе в Севастополе.",
  },
];

export function Services() {
  return (
    <section
      id="services"
      className="scroll-mt-24 border-y border-ocean-900/10 bg-white px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="services-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-600">
            Сервис
          </p>
          <h2
            id="services-heading"
            className="font-display mt-3 max-w-3xl text-balance text-3xl font-semibold text-ocean-950 sm:text-4xl"
          >
            Что мы предоставляем вместе с прокатом
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-ocean-900/75">
            Полный цикл: от заявки до эмоций на воде. Если вы ищете{" "}
            <a
              href="#contact"
              className="font-medium text-ocean-600 underline decoration-aqua-400/60 underline-offset-4 hover:text-ocean-800"
            >
              аренду джетсёрфа Севастополь
            </a>{" "}
            без сюрпризов — этот список как раз про прозрачность.
          </p>
        </Reveal>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <li className="flex h-full flex-col rounded-2xl border border-ocean-900/10 bg-sand-50/80 p-6 transition hover:border-ocean-600/25">
                <span className="font-display text-lg font-semibold text-ocean-950">
                  {item.title}
                </span>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ocean-900/75">
                  {item.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
