import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { userSlice } from '@services/user/reducer.ts';

import { ingredientModalSlice } from './ingredient-modal/reducer.ts';
import { ingredientsSlice } from './ingredients/reducer.ts';
import { orderSlice } from './order/reducer.ts';
import { selectedIngredientsSlice } from './selected-ingredients/reducer.ts';

const rootReducer = combineSlices(
  ingredientsSlice,
  orderSlice,
  ingredientModalSlice,
  selectedIngredientsSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
