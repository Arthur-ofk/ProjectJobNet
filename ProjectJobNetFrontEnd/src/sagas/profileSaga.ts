import { call, put, select, takeLatest } from 'redux-saga/effects';
import { API_BASE_URL } from '../constants.ts';
import { resizeImage } from '../utils/imageUtils.ts';
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
    
    // Resize the image first (in the saga instead of component)
    let optimizedFile;
    try {
      optimizedFile = yield call(resizeImage, file, 300, 0.6); // Even smaller and lower quality
    } catch (resizeError) {
      console.warn('Failed to resize image, using original:', resizeError);
      optimizedFile = file;
    }
    
    // Create form data with the optimized file
    const formData = new FormData();
    formData.append('profileImage', optimizedFile);
    
    // Use simplified headers and a chunked upload approach
    const response = yield call(fetch, `${API_BASE_URL}/users/${userId}/profile/image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Do NOT set Content-Type - let browser handle multipart boundaries
      },
      body: formData
    });
    
    if (response.status === 401) {
      yield put(logout());
      throw new Error('Your session has expired. Please login again.');
    }
    
    if (response.status === 431) {
      throw new Error('Image file is too large. Please try with a smaller image.');
    }
    
    if (!response.ok) {
      const errorText = yield call([response, 'text']);
      throw new Error(`Upload failed: ${response.status} ${errorText}`);
    }
    
    const data = yield call(safeJsonParse, response);
    
    // Update the profile slice
    yield put(uploadProfilePictureSuccess({ 
      imageData: data.profileImageData,
      contentType: data.profileImageContentType
    }));
    
    // Update the auth state through its proper action
    yield put({ 
      type: 'auth/updateUserProfile', 
      payload: {
        profileImageData: data.profileImageData,
        profileImageContentType: data.profileImageContentType
      }
    });
    
    // The localStorage update is now handled in the reducer
    
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    yield put(uploadProfilePictureFailure(error.message || 'Failed to upload profile picture'));
  }
}

function* deleteProfilePictureSaga(action: ReturnType<typeof deleteProfilePictureRequest>) {
  try {
    const { userId } = action.payload;
    // Ensure userId exists
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const token = yield select(state => state.auth.token);
    
    if (!token) {
      throw new Error('Authentication token is missing');
    }
    
    // Fix the endpoint URL to match the upload endpoint
    const response = yield call(fetch, `${API_BASE_URL}/users/${userId}/profile/image`, {
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
    
    // We no longer need this localStorage handling here since it's in the slice
    
  } catch (error) {
    console.error('Error deleting profile picture:', error);
    yield put(deleteProfilePictureFailure(error.message || 'Failed to delete profile picture'));
  }
}

export function* watchProfile() {
  yield takeLatest(uploadProfilePictureRequest.type, uploadProfilePictureSaga);
  yield takeLatest(deleteProfilePictureRequest.type, deleteProfilePictureSaga);
}
