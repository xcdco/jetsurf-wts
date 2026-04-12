import { faqItems } from "@/lib/faq-data";
import { Reveal } from "./Reveal";

export function FAQ() {
  return (
    <section
      id="faq"
      className="scroll-mt-24 bg-white px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="faq-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-600">
            FAQ
          </p>
          <h2
            id="faq-heading"
            className="font-display mt-3 max-w-3xl text-balance text-3xl font-semibold text-ocean-950 sm:text-4xl"
          >
            Вопросы про прокат джетсёрфа в Севастополе и Крыму
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-ocean-900/75">
            Коротко отвечаем на то, что чаще всего спрашивают перед бронью. Больше
            деталей — в{" "}
            <a
              href="#contact"
              className="font-medium text-ocean-600 underline decoration-aqua-400/60 underline-offset-4 hover:text-ocean-800"
            >
              форме связи
            </a>
            .
          </p>
        </Reveal>

        <div className="mt-12 space-y-3">
          {faqItems.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.04}>
              <details className="group rounded-2xl border border-ocean-900/10 bg-sand-50/50 px-5 py-4 open:bg-white open:shadow-[0_16px_50px_rgba(6,42,56,0.06)]">
                <summary className="cursor-pointer list-none font-display text-base font-semibold text-ocean-950 outline-none marker:content-none [&::-webkit-details-marker]:hidden">
                  <span className="flex items-center justify-between gap-3">
                    {item.q}
                    <span className="text-ocean-600 transition group-open:rotate-45">＋</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ocean-900/75">
                  {item.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
