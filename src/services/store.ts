import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { ingredientsSlice } from './ingredients/reducer.ts';
import { orderSlice } from './order/reducer.ts';
import { selectedIngredientSlice } from './selected-ingredient/reducer.ts';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
  order: orderSlice.reducer,
  selectedIngredient: selectedIngredientSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
