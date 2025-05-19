import { call, put, takeLatest, select } from 'redux-saga/effects';
import { API_BASE_URL } from '../constants.ts';
import {
  uploadProfilePictureRequest,
  uploadProfilePictureSuccess,
  uploadProfilePictureFailure,
  deleteProfilePictureRequest,
  deleteProfilePictureSuccess,
  deleteProfilePictureFailure
} from '../slices/profileSlice.ts';

function* uploadProfilePictureSaga(action: ReturnType<typeof uploadProfilePictureRequest>) {
  try {
    const { file, userId } = action.payload;
    const token = yield select(state => state.auth.token);
    
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = yield call(fetch, `${API_BASE_URL}/users/${userId}/profileimage`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const errorText = yield call([response, 'text']);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }
    
    const data = yield call([response, 'json']);
    
    yield put(uploadProfilePictureSuccess({ 
      imageData: data.profileImageData,
      contentType: data.profileImageContentType
    }));
    
    // Also update the user data in auth state
    yield put({ 
      type: 'auth/updateUserProfile', 
      payload: {
        profileImageData: data.profileImageData,
        profileImageContentType: data.profileImageContentType
      }
    });
    
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    yield put(uploadProfilePictureFailure(error.message || 'Failed to upload profile picture'));
  }
}

function* deleteProfilePictureSaga(action: ReturnType<typeof deleteProfilePictureRequest>) {
  try {
    const { userId } = action.payload;
    const token = yield select(state => state.auth.token);
    
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    
    const response = yield call(fetch, `${API_BASE_URL}/users/${userId}/profileimage`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = yield call([response, 'text']);
      throw new Error(`Delete failed: ${response.status} ${errorText}`);
    }
    
    yield put(deleteProfilePictureSuccess());
    
    // Also update the user data in auth state
    yield put({ 
      type: 'auth/updateUserProfile', 
      payload: {
        profileImageData: null,
        profileImageContentType: null
      }
    });
    
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    yield put(deleteProfilePictureFailure(error.message || 'Failed to delete profile picture'));
  }
}

export function* watchProfile() {
  yield takeLatest(uploadProfilePictureRequest.type, uploadProfilePictureSaga);
  yield takeLatest(deleteProfilePictureRequest.type, deleteProfilePictureSaga);
}
