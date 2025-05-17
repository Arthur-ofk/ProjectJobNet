import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchVacancyDetailRequest, fetchVacancyDetailSuccess, fetchVacancyDetailFailure } from '../slices/vacancyDetailSlice.ts';
import { API_BASE_URL } from '../constants.ts';

function* handleFetchVacancyDetail(action: ReturnType<typeof fetchVacancyDetailRequest>) {
  try {
    const { id } = action.payload;
    const response: Response = yield call(fetch, `${API_BASE_URL}/api/vacancies/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch vacancy details');
    }
    const data = yield response.json();
    yield put(fetchVacancyDetailSuccess(data));
  } catch (error: any) {
    yield put(fetchVacancyDetailFailure(error.message || 'Failed to fetch vacancy details'));
  }
}

export function* watchVacancyDetail() {
  yield takeLatest(fetchVacancyDetailRequest.type, handleFetchVacancyDetail);
}
