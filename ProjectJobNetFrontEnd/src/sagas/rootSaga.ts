import { all } from 'redux-saga/effects';
import { watchAuth } from './authSaga.ts';
import { watchVacancies } from './vacanciesSaga.ts';
import { watchServices } from './servicesSaga.ts';
import { watchNotifications } from './notificationsSaga.ts';

export default function* rootSaga() {
  yield all([watchAuth(), watchVacancies(), watchServices(), watchNotifications()]);
}
