import { call, put, select, takeLatest } from 'redux-saga/effects';
import { API_BASE_URL } from '../constants.ts';
import { 
  uploadProfilePictureRequest,
  uploadProfilePictureSuccess,
  uploadProfilePictureFailure,
  deleteProfilePictureRequest,
  deleteProfilePictureSuccess,
  deleteProfilePictureFailure} from '../slices/profileSlice.ts';
import { logout } from '../slices/authSlice.ts';

// Helper function for safe JSON parsing
const safeJsonParse = async (response: Response) => {
  try {
    const text = await response.text();
    return text ? JSON.parse(text) : null;
  } catch (error) {
    console.error('JSON parsing error:', error);
    return null;
  }
};

function* uploadProfilePictureSaga(action: ReturnType<typeof uploadProfilePictureRequest>) {
  try {
    const { file, userId } = action.payload;
    const token = yield select(state => state.auth.token);
    
    if (!token) {
      yield put(logout());
      throw new Error('Authentication token is missing');
    }
    
    // Create form data for file upload
    const formData = new FormData();
    formData.append('profileImage', file);
    
    // Use the correct endpoint path
    const response = yield call(fetch, `${API_BASE_URL}/users/${userId}/profile/image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    
    if (response.status === 401) {
      yield put(logout());
      throw new Error('Your session has expired. Please login again.');
    }
    
    if (!response.ok) {
      const errorText = yield call([response, 'text']);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }
    
    const data = yield call(safeJsonParse, response);
    
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
