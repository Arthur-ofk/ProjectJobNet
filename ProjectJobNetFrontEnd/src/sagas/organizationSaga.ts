import { call, put, takeLatest, select } from 'redux-saga/effects';
import { API_BASE_URL } from '../constants.ts';
import {
  fetchOrganizationRequest,
  fetchOrganizationSuccess,
  fetchOrganizationFailure,
  fetchOrganizationsRequest,
  fetchOrganizationsSuccess,
  fetchOrganizationsFailure,
  uploadOrganizationPictureRequest,
  uploadOrganizationPictureSuccess,
  uploadOrganizationPictureFailure,
} from '../slices/organizationSlice.ts';

function* handleFetchOrganization(action: ReturnType<typeof fetchOrganizationRequest>) {
  try {
    const id = action.payload;
    const token: string = yield select((state) => state.auth.token);
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response: Response = yield call(fetch, `${API_BASE_URL}/organization/${id}`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch organization');
    }
    
    const data = yield call([response, 'json']);
    yield put(fetchOrganizationSuccess(data));
  } catch (error: any) {
    yield put(fetchOrganizationFailure(error.message || 'Failed to fetch organization'));
  }
}

function* handleFetchOrganizations() {
  try {
    const token: string = yield select((state) => state.auth.token);
    
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response: Response = yield call(fetch, `${API_BASE_URL}/organization`, {
      headers
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch organizations');
    }
    
    const data = yield call([response, 'json']);
    yield put(fetchOrganizationsSuccess(data));
  } catch (error: any) {
    yield put(fetchOrganizationsFailure(error.message || 'Failed to fetch organizations'));
  }
}

function* uploadOrganizationPictureSaga(action: ReturnType<typeof uploadOrganizationPictureRequest>) {
  try {
    const { id, file } = action.payload;
    const token: string = yield select((state) => state.auth.token);
    
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    
    const formData = new FormData();
    formData.append('logoImage', file);
    
    const response: Response = yield call(fetch, `${API_BASE_URL}/organization/${id}/logo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText: string = yield call([response, 'text']);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }
    
    const data = yield call([response, 'json']);
    
    yield put(uploadOrganizationPictureSuccess({
      logoImageData: data.logoImageData,
      logoImageContentType: data.logoImageContentType
    }));
    
  } catch (error: any) {
    console.error('Error uploading organization picture:', error);
    yield put(uploadOrganizationPictureFailure(error.message || 'Failed to upload organization picture'));
  }
}

export function* watchOrganization() {
  yield takeLatest(fetchOrganizationRequest.type, handleFetchOrganization);
  yield takeLatest(fetchOrganizationsRequest.type, handleFetchOrganizations);
  yield takeLatest(uploadOrganizationPictureRequest.type, uploadOrganizationPictureSaga);
}
