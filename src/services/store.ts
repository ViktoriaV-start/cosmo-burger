import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { ingredientModalSlice } from './ingredient-modal/reducer.ts';
import { ingredientsSlice } from './ingredients/reducer.ts';
import { orderSlice } from './order/reducer.ts';
import { selectedIngredientsSlice } from './selected-ingredients/reducer.ts';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  order: orderSlice.reducer,
  ingredientModal: ingredientModalSlice.reducer,
  selectedIngredients: selectedIngredientsSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
