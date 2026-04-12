export type JetModel = {
  id: string;
  name: string;
  tagline: string;
  power: string;
  speed: string;
  duration: string;
  priceFrom: number;
  currency: string;
  /** Слайды в карточке каталога */
  images: string[];
  imageAlt: string;
};

export type CatalogFilter = "all" | "sup" | "jetsurf";

export const jetModels: JetModel[] = [
  {
    id: "jetsurf",
    name: "JetSurf",
    tagline: "Мощная моторная доска — скорость и контроль на воде",
    power: "12 кВт",
    speed: "до 60 км / ч",
    duration: "от 30 минут",
    priceFrom: 4500,
    currency: "₽",
    images: [
      "https://i.imgur.com/TJZKNZp.jpeg",
      "https://i.imgur.com/vIh7TPc.jpeg",
    ],
    imageAlt:
      "Джетсёрф — аренда моторной доски в Севастополе и на Чёрном море",
  },
];

export type SupModel = {
  id: string;
  name: string;
  tagline: string;
  duration: string;
  pricePerHour: number;
  currency: string;
  image: string;
  imageAlt: string;
  row1Label: string;
  row1Value: string;
  row2Label: string;
  row2Value: string;
  bonus?: string;
};

export const supModels: SupModel[] = [
  {
    id: "sup-inflatable",
    name: "Сапборд надувной",
    tagline:
      "Спокойное катание стоя: от часа до суток — выберите формат под настроение",
    duration: "от 1 часа · можно на сутки",
    pricePerHour: 700,
    currency: "₽",
    image: "https://i.imgur.com/JsRICmG.png",
    imageAlt:
      "Сапборд на воде в солнечный день — аренда SUP в Севастополе и Крыму",
    row1Label: "Формат",
    row1Value: "Почасово от 1 ч · сутки по запросу",
    row2Label: "Полный комплект",
    row2Value: "Маска, ласты, водонепроницаемый чехол, спасательный жилет",
    bonus:
      "У нас полный комплект идёт бонусом — без доплат за ласты и аксессуары, как часто бывает у других.",
  },
  {
    id: "sup-motor",
    name: "Сапборд с мотором",
    tagline: "Больше динамики: гребля плюс мотор для уверенного хода по воде",
    duration: "от 1 часа",
    pricePerHour: 1000,
    currency: "₽",
    image: "https://i.imgur.com/kSM4mqE.png",
    imageAlt:
      "Активный отдых на воде — сап с мотором, прокат в Крыму",
    row1Label: "Тариф",
    row1Value: "Почасовая аренда",
    row2Label: "Особенности",
    row2Value: "Доска с установленным мотором — уточним комплект при брони",
    bonus:
      "У нас полный комплект идёт бонусом — без доплат за ласты и аксессуары, как часто бывает у других.",
  },
];

export const filterTabs: { id: CatalogFilter; label: string }[] = [
  { id: "all", label: "Все" },
  { id: "sup", label: "Сапборды" },
  { id: "jetsurf", label: "Джетсёрфы" },
];
