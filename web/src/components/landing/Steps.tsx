import { Reveal } from "./Reveal";

const steps = [
  {
    n: "01",
    title: "Оставляете заявку",
    text: "Форма или мессенджер — укажите желаемую дату катания на джетсёрфе.",
  },
  {
    n: "02",
    title: "Подтверждаем время",
    text: "Согласуем слот, доску и точку выхода на воду в Севастополе/Крыму.",
  },
  {
    n: "03",
    title: "Проводим инструктаж",
    text: "Коротко, по делу: безопасность, газ, стойка, что делать в нестандарте.",
  },
  {
    n: "04",
    title: "Вы катаетесь",
    text: "Ловите скорость и эмоции — мы на связи, если понадобится помощь или совет.",
  },
];

export function Steps() {
  return (
    <section
      id="steps"
      className="scroll-mt-24 bg-ocean-950 px-4 py-20 text-white sm:px-6 sm:py-28"
      aria-labelledby="steps-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-aqua-300/90">
            Процесс
          </p>
          <h2
            id="steps-heading"
            className="font-display mt-3 max-w-2xl text-balance text-3xl font-semibold sm:text-4xl"
          >
            Как проходит аренда: 4 простых шага
          </h2>
        </Reveal>

        <ol className="mt-14 grid gap-6 md:grid-cols-2">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <li className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7">
                <span className="font-display text-5xl font-bold text-white/10">
                  {s.n}
                </span>
                <h3 className="font-display -mt-6 text-xl font-semibold">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {s.text}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
