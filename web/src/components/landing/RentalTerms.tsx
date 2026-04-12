import { Reveal } from "./Reveal";

const contractPoints = [
  "Фиксирует состояние доски до и после катания",
  "Подтверждает, что вы прошли инструктаж",
  "Страхует от случайных споров: царапины, поломки, время аренды",
];

export function RentalTerms() {
  return (
    <section
      id="rental-terms"
      className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="rental-terms-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-600">
            Условия
          </p>
          <h2
            id="rental-terms-heading"
            className="font-display mt-3 max-w-3xl text-balance text-3xl font-semibold text-ocean-950 sm:text-4xl"
          >
            Опыт, документы и договор
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          <Reveal>
            <article className="h-full rounded-3xl border border-ocean-900/10 bg-sand-50/80 p-7">
              <h3 className="font-display text-lg font-semibold text-ocean-950">
                Нужен ли опыт, чтобы прокатиться на JET SURF?
              </h3>
              <p className="mt-3 text-sm font-medium leading-relaxed text-ocean-800">
                Совсем не нужен — главное желание и настрой на незабываемые эмоции.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ocean-900/80">
                Попробовать может каждый, кому уже исполнилось 18 лет — либо в
                присутствии родителей. Перед стартом проведём инструктаж: Вы быстро
                научитесь чувствовать баланс и управлять газом.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.06}>
            <article className="h-full rounded-3xl border border-ocean-900/10 bg-sand-50/80 p-7">
              <h3 className="font-display text-lg font-semibold text-ocean-950">
                Необходимые документы для аренды JET SURF
              </h3>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ocean-900/85">
                <li className="flex gap-2">
                  <span className="text-ocean-500">·</span>
                  <span>Паспорт РФ (оригинал)</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-ocean-500">·</span>
                  <span>
                    Договор заключается на месте — это быстро, без лишней бюрократии
                  </span>
                </li>
              </ul>
            </article>
          </Reveal>

          <Reveal delay={0.12}>
            <article className="h-full rounded-3xl border border-ocean-600/20 bg-ocean-950 p-7 text-white">
              <h3 className="font-display text-lg font-semibold">
                Зачем нужен договор?
              </h3>
              <p className="mt-2 text-sm text-white/70">
                Это ваша безопасность и прозрачность:
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-white/90">
                {contractPoints.map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-aqua-400" aria-hidden>
                      ✓
                    </span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
