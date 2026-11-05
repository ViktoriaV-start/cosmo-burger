import { combineSlices, configureStore } from '@reduxjs/toolkit';

import { ingredientModalSlice } from './ingredient-modal/reducer.ts';
import { ingredientsSlice } from './ingredients/reducer.ts';
import { orderSlice } from './order/reducer.ts';
import { selectedIngredientsSlice } from './selected-ingredients/reducer.ts';
import { socketApi } from './socket/api.ts';
import { userSlice } from './user/reducer.ts';

const rootReducer = combineSlices(
  ingredientsSlice,
  orderSlice,
  ingredientModalSlice,
  selectedIngredientsSlice,
  userSlice,
  socketApi
);

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(socketApi.middleware),
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
