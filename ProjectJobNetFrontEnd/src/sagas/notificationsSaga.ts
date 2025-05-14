import { call, put, takeEvery } from 'redux-saga/effects';
import { API_BASE_URL } from '../constants.ts';
import {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
} from '../slices/notificationsSlice.ts';

function* handleFetchNotifications(action: ReturnType<typeof fetchNotificationsRequest>) {
  try {
    const { userId, token } = action.payload;
    const response: Response = yield call(fetch, `${API_BASE_URL}/order/notifications/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error('Failed to fetch notifications');
    const data = yield response.json();
    yield put(fetchNotificationsSuccess(data));
  } catch (error: any) {
    yield put(fetchNotificationsFailure(error.message || 'Failed to fetch notifications'));
  }
}

export function* watchNotifications() {
  yield takeEvery(fetchNotificationsRequest.type, handleFetchNotifications);
}
