export type Ingredient = {
  id?: string;
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type Order = {
  bun: Ingredient | null;
  ingredients: Ingredient[] | [];
};

export type IngredientType = 'bun' | 'sauce' | 'main';

export type User = {
  email: string;
  password: string;
  name: string;
};

export type AuthResponse = {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
};

export type RefreshTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type AuthRequestResponse = {
  success: boolean;
  message: string;
};

export type UserAuthResponse = {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
};

export type FeedOrderIngredient = Pick<Ingredient, 'name' | 'image_mobile'>;

export type FeedOrder = {
  number: number;
  name: string;
  createdAt: string;
  ingredients: FeedOrderIngredient[];
  price: number;
};

export type OrdersFeed = {
  orders: FeedOrder[];
  ready: number[];
  inProgress: number[];
  total: number;
  totalToday: number;
};
