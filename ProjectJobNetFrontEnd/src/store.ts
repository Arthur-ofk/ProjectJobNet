import { configureStore } from '@reduxjs/toolkit';
import vacanciesReducer from './slices/vacanciesSlice.ts';
import servicesReducer from './slices/servicesSlice.ts';
import authReducer from './slices/authSlice.ts';

const store = configureStore({
  reducer: {
    vacancies: vacanciesReducer,
    services: servicesReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;