export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://jetsurf-crimea.ru";

export const business = {
  name: "JetSurf Севастополь",
  legalName: "JetSurf Севастополь — аренда джетсёрфа",
  phone: "+7 (979) 052-08-92",
  phoneTel: "+79790520892",
  email: "hello@jetsurf-crimea.ru",
  telegram: "https://t.me/Daniil_WTS",
  whatsapp: "https://wa.me/79790520892",
  address: {
    streetAddress: "Набережная — точка на карте; финальная зона катания уточняется при брони",
    addressLocality: "Севастополь",
    addressRegion: "Крым",
    postalCode: "299011",
    addressCountry: "RU",
  },
  geo: {
    lat: 44.597246,
    lng: 33.444578,
  },
  /** Построить маршрут в Яндекс.Картах (конечная точка) */
  yandexMapsRouteUrl:
    "https://yandex.ru/maps/?rtext=~44.597246,33.444578&rtt=auto",
  /** Карта с меткой */
  yandexMapsPointUrl:
    "https://yandex.ru/maps/?pt=33.444578,44.597246&z=16&l=map",
  openingHours: ["Mo-Su 09:00-20:00"],
  sameAs: [
    "https://t.me/Daniil_WTS",
    "https://instagram.com/jetsurf_sevastopol",
  ],
} as const;

export const defaultTitle =
  "Аренда джетсёрфа в Севастополе и Крыму — прокат JetSurf с инструктажом";

export const defaultDescription =
  "Прокат jet surf в Крыму: инструктаж и экипировка. Катание на джетсёрфе в Севастополе для новичков и профи. Узнайте цену и забронируйте слот онлайн.";
