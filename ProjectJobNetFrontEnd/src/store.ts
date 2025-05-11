import { configureStore } from '@reduxjs/toolkit';
import vacanciesReducer from './slices/vacanciesSlice.ts';
import servicesReducer from './slices/servicesSlice.ts';

const store = configureStore({
  reducer: {
    vacancies: vacanciesReducer,
    services: servicesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;