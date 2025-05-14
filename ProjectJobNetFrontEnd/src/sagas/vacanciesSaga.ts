import { call, put, takeLatest } from 'redux-saga/effects';
import { API_BASE_URL } from '../constants.ts';
import {
  fetchVacanciesRequest,
  fetchVacanciesSuccess,
  fetchVacanciesFailure,
} from '../slices/vacanciesSlice.ts';

function* handleFetchVacancies() {
  try {
    const response: Response = yield call(fetch, `${API_BASE_URL}/jobs`);
    if (!response.ok) throw new Error('Failed to fetch vacancies');
    const data = yield response.json();
    yield put(fetchVacanciesSuccess(data));
  } catch (error: any) {
    yield put(fetchVacanciesFailure(error.message || 'Failed to fetch vacancies'));
  }
}

export function* watchVacancies() {
  yield takeLatest(fetchVacanciesRequest.type, handleFetchVacancies);
}
