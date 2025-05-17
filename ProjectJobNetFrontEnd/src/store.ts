import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import authReducer from './slices/authSlice.ts';
import vacanciesReducer from './slices/vacanciesSlice.ts';
import servicesReducer from './slices/servicesSlice.ts';
import notificationsReducer from './slices/notificationsSlice.ts';
import blogReducer from './slices/blogSlice.ts';
import vacancyDetailReducer from './slices/vacancyDetailSlice.ts';
import rootSaga from './sagas/rootSaga.ts';

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
    auth: authReducer,
    vacancies: vacanciesReducer,
    services: servicesReducer,
    notifications: notificationsReducer,
    blog: blogReducer,
    vacancyDetail: vacancyDetailReducer,
  },
  preloadedState: { auth: preloadedAuth },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      thunk: false,
      serializableCheck: {
        ignoredActions: ['blog/createPostRequest'],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;