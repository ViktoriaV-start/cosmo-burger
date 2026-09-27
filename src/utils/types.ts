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

export type RegisterResponse = {
  success: boolean;
  user: {
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
};
