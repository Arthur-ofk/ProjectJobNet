import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Extract initial profile image data from localStorage if available
const loadInitialState = () => {
  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      return {
        profileImageData: user.profileImageData || null,
        profileImageContentType: user.profileImageContentType || null,
      };
    }
  } catch (e) {
    console.error('Error loading profile data from localStorage:', e);
  }
  return { profileImageData: null, profileImageContentType: null };
};

const initialData = loadInitialState();

export interface ProfileState {
  profileImageData: string | null;
  profileImageContentType: string | null;
  isUploading: boolean;
  isDeleting: boolean;
  uploadError: string | null;
  deleteError: string | null;
  showUploadForm: boolean;
  imageUpdateTimestamp: number;
}

const initialState: ProfileState = {
  profileImageData: initialData.profileImageData,
  profileImageContentType: initialData.profileImageContentType,
  isUploading: false,
  isDeleting: false,
  uploadError: null,
  deleteError: null,
  showUploadForm: false,
  imageUpdateTimestamp: Date.now() // Add timestamp to track updates
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    uploadProfilePictureRequest(state, action) {
      state.isUploading = true;
      state.uploadError = null;
    },
    uploadProfilePictureSuccess(state, action: PayloadAction<{ imageData: string, contentType: string }>) {
      state.isUploading = false;
      state.profileImageData = action.payload.imageData;
      state.profileImageContentType = action.payload.contentType;
      state.imageUpdateTimestamp = Date.now(); // Update timestamp
      
      // Update auth user in localStorage 
      try {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          user.profileImageData = action.payload.imageData;
          user.profileImageContentType = action.payload.contentType;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (err) {
        console.error('Error updating user in localStorage:', err);
      }
    },
    uploadProfilePictureFailure(state, action: PayloadAction<string>) {
      state.isUploading = false;
      state.uploadError = action.payload;
    },
    deleteProfilePictureRequest(state) {
      state.isDeleting = true;
      state.deleteError = null;
    },
    deleteProfilePictureSuccess(state) {
      state.isDeleting = false;
      state.profileImageData = null;
      state.profileImageContentType = null;
      state.imageUpdateTimestamp = Date.now(); // Update timestamp
      
      // Update auth user in localStorage 
      try {
        const userJson = localStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          user.profileImageData = null;
          user.profileImageContentType = null;
          localStorage.setItem('user', JSON.stringify(user));
        }
      } catch (err) {
        console.error('Error updating user in localStorage:', err);
      }
    },
    deleteProfilePictureFailure(state, action: PayloadAction<string>) {
      state.isDeleting = false;
      state.deleteError = action.payload;
    },
    toggleUploadForm(state) {
      state.showUploadForm = !state.showUploadForm;
    },
    setProfilePictureData(state, action: PayloadAction<{ imageData: string | null, contentType: string | null }>) {
      state.profileImageData = action.payload.imageData;
      state.profileImageContentType = action.payload.contentType;
      state.imageUpdateTimestamp = Date.now(); // Update timestamp
    },
    forceImageUpdate(state) {
      state.imageUpdateTimestamp = Date.now(); // Force update timestamp
    }
  }
});

export const {
  uploadProfilePictureRequest,
  uploadProfilePictureSuccess,
  uploadProfilePictureFailure,
  deleteProfilePictureRequest,
  deleteProfilePictureSuccess,
  deleteProfilePictureFailure,
  toggleUploadForm,
  setProfilePictureData,
  forceImageUpdate
} = profileSlice.actions;

export default profileSlice.reducer;
