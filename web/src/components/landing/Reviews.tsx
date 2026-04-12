import Image from "next/image";
import { Reveal } from "./Reveal";

const reviews = [
  {
    name: "Алина, 28",
    city: "Москва",
    text: "Первый раз на джетсёрфе в Севастополе — очень спокойный инструктаж, через 15 минут уже летала над водой. Впечатления на весь отпуск!",
    rating: 5,
    img: "https://i.pravatar.cc/128?img=32",
    alt: "Портрет гостьи, оставившей отзыв об аренде джетсёрфа",
  },
  {
    name: "Игорь и Ксения",
    city: "Екатеринбург",
    text: "Брали часовой пакет. Прокат jet surf в Крыму оказался удобнее, чем ожидали: всё включено, нас провели от А до Я.",
    rating: 5,
    img: "https://i.pravatar.cc/128?img=12",
    alt: "Фото пары туристов после катания на джетсёрфе",
  },
  {
    name: "Дмитрий, 36",
    city: "Санкт-Петербург",
    text: "Катаюсь не первый сезон — здесь дали нормальную динамику и безопасную зону. Цена/качество на уровне.",
    rating: 5,
    img: "https://i.pravatar.cc/128?img=68",
    alt: "Портрет опытного райдера с отзывом о джетсёрфе",
  },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-0.5 text-sun-400" aria-label={`Рейтинг ${n} из 5`}>
      {Array.from({ length: n }).map((_, i) => (
        <svg key={i} className="h-4 w-4 fill-current" viewBox="0 0 20 20" aria-hidden>
          <path d="M10 1.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L10 14.9l-5.25 2.8 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
        </svg>
      ))}
    </span>
  );
}

export function Reviews() {
  return (
    <section
      id="reviews"
      className="scroll-mt-24 bg-sand-50 px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="reviews-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-600">
            Отзывы
          </p>
          <h2
            id="reviews-heading"
            className="font-display mt-3 max-w-3xl text-balance text-3xl font-semibold text-ocean-950 sm:text-4xl"
          >
            Эмоции гостей после катания на джетсёрфе
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-ocean-900/75">
            Короткие истории туристов и активных ребят, которые выбрали аренду
            джетсёрфа в Крыму у нас.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {reviews.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.06}>
              <article className="flex h-full flex-col rounded-3xl border border-ocean-900/10 bg-white p-6 shadow-[0_18px_60px_rgba(6,42,56,0.06)]">
                <div className="flex items-center gap-3">
                  <Image
                    src={r.img}
                    alt={r.alt}
                    title={`${r.name} — отзыв о прокате в Севастополе`}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                    loading="lazy"
                  />
                  <div>
                    <p className="font-semibold text-ocean-950">{r.name}</p>
                    <p className="text-xs text-ocean-900/55">{r.city}</p>
                  </div>
                </div>
                <Stars n={r.rating} />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-ocean-900/80">
                  «{r.text}»
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
