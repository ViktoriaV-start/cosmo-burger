import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { ingredientsSlice } from './ingredients/reducer.ts';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
