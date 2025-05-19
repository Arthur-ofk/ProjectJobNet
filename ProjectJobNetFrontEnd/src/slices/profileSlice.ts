import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
  profileImageData: string | null;
  profileImageContentType: string | null;
  isUploading: boolean;
  isDeleting: boolean;
  uploadError: string | null;
  deleteError: string | null;
  showUploadForm: boolean;
}

const initialState: ProfileState = {
  profileImageData: null,
  profileImageContentType: null,
  isUploading: false,
  isDeleting: false,
  uploadError: null,
  deleteError: null,
  showUploadForm: false,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    toggleUploadForm(state) {
      state.showUploadForm = !state.showUploadForm;
      // Reset errors when toggling form
      state.uploadError = null;
      state.deleteError = null;
    },
    
    uploadProfilePictureRequest(state, action: PayloadAction<{ file: File, userId: string }>) {
      state.isUploading = true;
      state.uploadError = null;
    },
    
    uploadProfilePictureSuccess(state, action: PayloadAction<{ imageData: string, contentType: string }>) {
      state.isUploading = false;
      state.profileImageData = action.payload.imageData;
      state.profileImageContentType = action.payload.contentType;
      state.showUploadForm = false; // Close form on success
    },
    
    uploadProfilePictureFailure(state, action: PayloadAction<string>) {
      state.isUploading = false;
      state.uploadError = action.payload;
    },
    
    deleteProfilePictureRequest(state, action: PayloadAction<{ userId: string }>) {
      state.isDeleting = true;
      state.deleteError = null;
    },
    
    deleteProfilePictureSuccess(state) {
      state.isDeleting = false;
      state.profileImageData = null;
      state.profileImageContentType = null;
      state.showUploadForm = false; // Close form on success
    },
    
    deleteProfilePictureFailure(state, action: PayloadAction<string>) {
      state.isDeleting = false;
      state.deleteError = action.payload;
    },
    
    // Initialize profile picture data from user data
    setProfilePictureData(state, action: PayloadAction<{ imageData: string | null, contentType: string | null }>) {
      state.profileImageData = action.payload.imageData;
      state.profileImageContentType = action.payload.contentType;
    }
  }
});

export const {
  toggleUploadForm,
  uploadProfilePictureRequest,
  uploadProfilePictureSuccess,
  uploadProfilePictureFailure,
  deleteProfilePictureRequest,
  deleteProfilePictureSuccess,
  deleteProfilePictureFailure,
  setProfilePictureData
} = profileSlice.actions;

export default profileSlice.reducer;
