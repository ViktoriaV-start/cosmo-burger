import type { FeedOrderIngredient, OrdersFeed } from './types';

// Тестовые данные ленты заказов по макету — пока нет API ленты
const IMAGE_URL = 'https://code.s3.yandex.net/react/code';

const ingredient = (
  name: string,
  image: string,
  price: number
): FeedOrderIngredient => ({
  name,
  image_mobile: `${IMAGE_URL}/${image}-mobile.png`,
  price,
});

const BUN_PURPLE = ingredient('Флюоресцентная булка R2-D3', 'bun-01', 20);
const BUN_CRATER = ingredient('Краторная булка N-200i', 'bun-02', 20);
const MEAT_PROTOSTOMIA = ingredient(
  'Мясо бессмертных моллюсков Protostomia',
  'meat-02',
  300
);
const MEAT_BEEF = ingredient('Говяжий метеорит (отбивная)', 'meat-04', 300);
const RINGS = ingredient('Хрустящие минеральные кольца', 'mineral_rings', 40);
const CHEESE = ingredient('Сыр с астероидной плесенью', 'cheese', 60);
const SAUCE_SPICY = ingredient('Соус Spicy-X', 'sauce-02', 30);
const SAUCE_TRADITIONAL = ingredient('Соус традиционный галактический', 'sauce-03', 30);
const SALAD = ingredient('Мини-салат Экзо-Плантаго', 'salad', 40);
const CORE = ingredient('Кристаллы марсианских альфа-сахаридов', 'core', 80);
const MEAT_FILLET = ingredient('Филе Люминесцентного тетраодонтимформа', 'meat-03', 300);
const SPORES = ingredient('Плоды Фалленианского дерева', 'sp_1', 80);

const dateAt = (daysAgo: number, hours: number, minutes: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  date.setHours(hours, minutes, 0, 0);

  return date.toISOString();
};

export const FEED_MOCK: OrdersFeed = {
  orders: [
    {
      number: 34535,
      status: 'done',
      name: 'Death Star Starship Main бургер',
      createdAt: dateAt(0, 16, 20),
      ingredients: [BUN_CRATER, MEAT_PROTOSTOMIA, MEAT_FILLET, RINGS, CHEESE],
      price: 480,
    },
    {
      number: 34534,
      status: 'pending',
      name: 'Interstellar бургер',
      createdAt: dateAt(0, 13, 20),
      ingredients: [
        BUN_CRATER,
        MEAT_PROTOSTOMIA,
        MEAT_FILLET,
        RINGS,
        CHEESE,
        MEAT_BEEF,
        SAUCE_SPICY,
        SALAD,
        CORE,
      ],
      price: 560,
    },
    {
      number: 34533,
      status: 'done',
      name: 'Black Hole Singularity острый бургер',
      createdAt: dateAt(1, 13, 50),
      ingredients: [BUN_PURPLE, MEAT_FILLET, SAUCE_TRADITIONAL, SPORES, BUN_PURPLE],
      price: 510,
    },
    {
      number: 34532,
      status: 'created',
      name: 'Supernova Infinity бургер',
      createdAt: dateAt(2, 21, 53),
      ingredients: [BUN_PURPLE, CORE, SAUCE_TRADITIONAL],
      price: 370,
    },
  ],
  ready: [34533, 34532, 34530, 34527, 34525],
  inProgress: [34538, 34541, 34542],
  total: 28752,
  totalToday: 138,
};
