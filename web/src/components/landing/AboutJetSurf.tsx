import { Reveal } from "./Reveal";

const perks = [
  {
    title: "Инструктаж перед стартом",
    body: "Разбираем стойку, газ, развороты и безопасную зону катания на воде у Севастополя.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 3v4M8 21h8M10 14h4M9 10l3-3 3 3"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Экипировка включена",
    body: "Гидрокостюм/лайкра по сезону, шлем, спасжилет — чтобы вы чувствовали себя уверенно.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M8 10h8v10H8zM9 6a3 3 0 016 0v4H9V6z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Подходит новичкам",
    body: "Первые минуты — спокойный режим и понятные подсказки. Опытым райдерам — больше динамики.",
    icon: (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M5 20l4-14h6l4 14M9 10h6"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

export function AboutJetSurf() {
  return (
    <section
      id="about"
      className="scroll-mt-28 bg-sand-50 px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="about-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-600">
            Что такое JetSurf
          </p>
          <h2
            id="about-heading"
            className="font-display mt-3 max-w-3xl text-balance text-3xl font-semibold text-ocean-950 sm:text-4xl"
          >
            Моторная доска, которая дарит ощущение полёта над водой
          </h2>
          <p className="mt-5 max-w-3xl text-pretty text-lg leading-relaxed text-ocean-900/80">
            Джетсёрф — компактная доска с мотором: вы стоите, управляете газом и
            буквально «режете» гладь. Это про{" "}
            <a
              href="#models"
              className="font-medium text-ocean-600 underline decoration-aqua-400/60 underline-offset-4 hover:text-ocean-800"
            >
              скорость и свободу
            </a>
            , но при этом формат остаётся контролируемым благодаря инструктажу на
            месте. Аренда джетсёрфа в Севастополе популярна у туристов
            20–45 лет, пар и небольших компаний — и у тех, кто пробует впервые, и
            у тех, кто уже ловил волну на других спотах.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {perks.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <article className="group h-full rounded-2xl border border-ocean-900/10 bg-white p-6 shadow-[0_18px_60px_rgba(6,42,56,0.06)] transition hover:-translate-y-1 hover:border-aqua-400/40 hover:shadow-[0_24px_70px_rgba(15,111,143,0.12)]">
                <div className="inline-flex rounded-xl bg-ocean-900/5 p-3 text-ocean-600 transition group-hover:bg-aqua-400/15 group-hover:text-ocean-800">
                  {p.icon}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ocean-950">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ocean-900/75">
                  {p.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 rounded-3xl border border-ocean-600/15 bg-gradient-to-br from-white to-aqua-300/20 p-8 sm:p-10">
          <h3 className="font-display text-xl font-semibold text-ocean-950 sm:text-2xl">
            Почему это безопасно
          </h3>
          <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-ocean-900/80">
            Мы не отпускаем «в никуда»: заранее объясняем правила, ограничения по
            ветру и зоне, подбираем модель под уровень. Прокат jet surf в Крыму у
            нас — это дисциплина, спокойный подход и понятные шаги, чтобы
            вы получили эмоции без лишнего риска. Катание на джетсёрфе в
            Севастополе — отличный формат и для{" "}
            <a
              href="#pricing"
              className="font-medium text-ocean-600 underline decoration-aqua-400/60 underline-offset-4 hover:text-ocean-800"
            >
              короткой сессии 30 минут
            </a>
            , и для более длинного заезда.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
