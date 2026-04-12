"use client";

import { Reveal } from "./Reveal";

const clips = [
  {
    src: "https://i.imgur.com/OMPEHPf.mp4",
    title: "Катание 1",
    caption: "Гости на воде — джетсёрф и сапы в аренду",
  },
  {
    src: "https://i.imgur.com/YN7J2HB.mp4",
    title: "Катание 2",
    caption: "Моменты с проката у нас в Севастополе",
  },
  {
    src: "https://i.imgur.com/MNTzXWP.mp4",
    title: "Катание 3",
    caption: "Активный отдых в Крыму",
  },
] as const;

export function RentalVideos() {
  return (
    <section
      id="videos"
      className="scroll-mt-24 border-t border-ocean-900/10 bg-white px-4 py-20 sm:px-6 sm:py-28"
      aria-labelledby="videos-heading"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-ocean-600">
            Видео с проката
          </p>
          <h2
            id="videos-heading"
            className="font-display mt-3 text-balance text-3xl font-semibold text-ocean-950 sm:text-4xl"
          >
            Как катаются наши гости
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-ocean-900/75">
            Короткие ролики с воды: джетсёрф, сапы и другой арендованный у нас инвентарь в
            Севастополе.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {clips.map((clip, i) => (
            <Reveal key={clip.title} delay={i * 0.08}>
              <figure className="overflow-hidden rounded-2xl border border-ocean-900/10 bg-ocean-950 shadow-[0_24px_80px_rgba(6,42,56,0.12)]">
                <video
                  className="aspect-video w-full object-cover"
                  controls
                  playsInline
                  preload="metadata"
                  title={clip.title}
                >
                  <source src={clip.src} type="video/mp4" />
                  Ваш браузер не поддерживает встроенное видео.
                </video>
                <figcaption className="border-t border-white/10 bg-ocean-900/40 px-4 py-3 text-sm text-white/85">
                  {clip.caption}
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
