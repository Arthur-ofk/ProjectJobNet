import { call, put, takeLatest } from 'redux-saga/effects';
import { API_BASE_URL } from '../constants.ts';
import {
  fetchServicesRequest,
  fetchServicesSuccess,
  fetchServicesFailure,
  upvoteServiceRequested,
  upvoteServiceSuccess,
  downvoteServiceRequested,
  downvoteServiceSuccess,
} from '../slices/servicesSlice.ts';

function* handleFetchServices() {
  try {
    const response: Response = yield call(fetch, `${API_BASE_URL}/services`);
    if (!response.ok) throw new Error('Failed to fetch services');
    const data = yield response.json();
    yield put(fetchServicesSuccess(data));
  } catch (error: any) {
    yield put(fetchServicesFailure(error.message || 'Failed to fetch services'));
  }
}

function* handleUpvoteService(action: ReturnType<typeof upvoteServiceRequested>) {
  try {
    const response: Response = yield call(fetch, `${API_BASE_URL}/services/${action.payload}/upvote`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to upvote service');
    yield put(upvoteServiceSuccess({ serviceId: action.payload }));
  } catch (error: any) {
    // Optionally, dispatch failure action here
  }
}

function* handleDownvoteService(action: ReturnType<typeof downvoteServiceRequested>) {
  try {
    const response: Response = yield call(fetch, `${API_BASE_URL}/services/${action.payload}/downvote`, {
      method: 'POST',
    });
    if (!response.ok) throw new Error('Failed to downvote service');
    yield put(downvoteServiceSuccess({ serviceId: action.payload }));
  } catch (error: any) {
    // Optionally, dispatch failure action here
  }
}

export function* watchServices() {
  yield takeLatest(fetchServicesRequest.type, handleFetchServices);
  yield takeLatest(upvoteServiceRequested.type, handleUpvoteService);
  yield takeLatest(downvoteServiceRequested.type, handleDownvoteService);
}
