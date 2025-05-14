import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga'; // Run: npm install redux-saga @types/redux-saga
import vacanciesReducer from './slices/vacanciesSlice.ts';
import servicesReducer from './slices/servicesSlice.ts';
import authReducer from './slices/authSlice.ts';
import notificationsReducer from './slices/notificationsSlice.ts'; // Ensure this file exists (see below)
import rootSaga from './sagas/rootSaga.ts'; // Ensure this file exists (see below)

const sagaMiddleware = createSagaMiddleware();

const preloadedAuth = {
  token: localStorage.getItem('token') || null,
  user: localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user')!)
    : null,
  loading: false,
  error: null,
};

const store = configureStore({
  reducer: {
    vacancies: vacanciesReducer,
    services: servicesReducer,
    auth: authReducer,
    notifications: notificationsReducer,
  },
  preloadedState: {
    auth: preloadedAuth,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;