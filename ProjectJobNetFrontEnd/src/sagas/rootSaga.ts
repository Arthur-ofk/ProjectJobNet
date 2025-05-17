import { all } from 'redux-saga/effects';
import { watchBlog } from './blogSaga.ts';
import { watchAuth } from './authSaga.ts';
import { watchVacancies } from './vacanciesSaga.ts';
import { watchServices } from './servicesSaga.ts';
import { watchNotifications } from './notificationsSaga.ts';
// ...import other sagas if needed...

export default function* rootSaga() {
  yield all([
    watchBlog(),
    watchAuth(),
    watchVacancies(),
    watchServices(),
    watchNotifications(),
    // ...other sagas...
  ]);
}
