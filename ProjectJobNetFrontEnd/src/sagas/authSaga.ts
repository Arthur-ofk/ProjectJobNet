import { call, put, takeLatest } from 'redux-saga/effects';
import { API_BASE_URL } from '../constants.ts';
import {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
} from '../slices/authSlice.ts';

function* handleLogin(action: ReturnType<typeof loginRequest>) {
  try {
    const response: Response = yield call(fetch, `${API_BASE_URL}/Auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });
    if (!response.ok) {
      const err = yield response.json();
      yield put(loginFailure(err.message || 'Login failed'));
      return;
    }
    const data = yield response.json();
    yield put(loginSuccess(data));
  } catch (error: any) {
    yield put(loginFailure(error.message || 'Login failed'));
  }
}

function* handleRegister(action: ReturnType<typeof registerRequest>) {
  try {
    const response: Response = yield call(fetch, `${API_BASE_URL}/Auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });
    if (!response.ok) {
      const err = yield response.json();
      yield put(registerFailure(err.message || 'Registration failed'));
      return;
    }
    const data = yield response.json();
    yield put(registerSuccess(data));
  } catch (error: any) {
    yield put(registerFailure(error.message || 'Registration failed'));
  }
}

export function* watchAuth() {
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(registerRequest.type, handleRegister);
}
