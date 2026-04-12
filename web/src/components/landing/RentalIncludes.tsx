import { Reveal } from "./Reveal";

const blocks = [
  {
    n: "1",
    title: "Мощный JET SURF",
    subtitle: "Сердце вашего приключения",
    body: null as string | null,
    bullets: null as string[] | null,
  },
  {
    n: "2",
    title: "Полная экипировка для безопасности",
    subtitle: "Ваша защита — наш приоритет",
    body: null,
    bullets: ["Спасательный жилет", "Гидрокостюм", "Шлем"],
  },
  {
    n: "3",
    title: "Водонепроницаемый чехол для телефона",
    subtitle: null,
    body: "Запечатлейте свои эмоции. Мы выдаём герметичный чехол — телефон останется сухим даже при активных манёврах.",
    bullets: null,
  },
  {
    n: "4",
    title: "Детальный инструктаж",
    subtitle: null,
    body: "Инструктор подробно объяснит технику управления, правила безопасности и даст лайфхаки для уверенного катания и ярких впечатлений.",
    bullets: null,
  },
];

export function RentalIncludes() {
  return (
    <section
      id="included"
      className="scroll-mt-24 border-t border-ocean-900/10 bg-gradient-to-b from-white to-sand-50 px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="included-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-600">
            Комплектация
          </p>
          <h2
            id="included-heading"
            className="font-display mt-3 max-w-3xl text-balance text-3xl font-semibold text-ocean-950 sm:text-4xl"
          >
            Что входит в аренду JET SURF?
          </h2>
          <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-ocean-900/80">
            Мы позаботились о полной готовности — чтобы вы забыли о бытовых мелочах
            и наслаждались скоростью и драйвом.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {blocks.map((b, i) => (
            <Reveal key={b.n} delay={i * 0.05}>
              <article className="flex h-full flex-col rounded-3xl border border-ocean-900/10 bg-white p-6 shadow-[0_18px_60px_rgba(6,42,56,0.06)] sm:p-8">
                <span className="font-display text-4xl font-bold text-aqua-400/90">
                  {b.n}
                </span>
                <h3 className="font-display mt-2 text-xl font-semibold text-ocean-950">
                  {b.title}
                </h3>
                {b.subtitle && (
                  <p className="mt-1 text-sm font-medium text-ocean-600">{b.subtitle}</p>
                )}
                {b.body && (
                  <p className="mt-3 text-sm leading-relaxed text-ocean-900/80">
                    {b.body}
                  </p>
                )}
                {b.bullets && (
                  <ul className="mt-4 space-y-2 text-sm text-ocean-900/85">
                    {b.bullets.map((x) => (
                      <li key={x} className="flex gap-2">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-ocean-500" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10">
          <p className="text-center text-sm text-ocean-900/60">
            Подробнее о слотах и тарифах — в блоке{" "}
            <a
              href="#pricing"
              className="font-medium text-ocean-600 underline decoration-aqua-400/50 underline-offset-4 hover:text-ocean-800"
            >
              цены и пакеты
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
