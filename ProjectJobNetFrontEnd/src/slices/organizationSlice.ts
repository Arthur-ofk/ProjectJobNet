import { createSlice, PayloadAction, createAction } from '@reduxjs/toolkit';

export interface Organization {
  id: string;
  name: string;
  description: string;
  industry: string;
  website: string;
  address: string;
  logoUrl: string;
  createdAt: string;
  updatedAt: string;
  logoImageData?: string;
  logoImageContentType?: string;
}

interface OrganizationState {
  currentOrganization: Organization | null;
  organizations: Organization[];
  loading: boolean;
  error: string | null;
  isUploading: boolean;
  uploadError: string | null;
  showUploadForm: boolean;
}

const initialState: OrganizationState = {
  currentOrganization: null,
  organizations: [],
  loading: false,
  error: null,
  isUploading: false,
  uploadError: null,
  showUploadForm: false
};

// Action creators for profile picture upload
export const uploadOrganizationPictureRequest = createAction<{ id: string; file: File }>('organization/uploadPictureRequest');
export const uploadOrganizationPictureSuccess = createAction<{ logoImageData: string, logoImageContentType: string }>('organization/uploadPictureSuccess');
export const uploadOrganizationPictureFailure = createAction<string>('organization/uploadPictureFailure');

const organizationSlice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    fetchOrganizationRequest(state, action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    fetchOrganizationSuccess(state, action: PayloadAction<Organization>) {
      state.loading = false;
      state.currentOrganization = action.payload;
    },
    fetchOrganizationFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    fetchOrganizationsRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchOrganizationsSuccess(state, action: PayloadAction<Organization[]>) {
      state.loading = false;
      state.organizations = action.payload;
    },
    fetchOrganizationsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    toggleUploadForm(state) {
      state.showUploadForm = !state.showUploadForm;
      // Reset errors when toggling form
      state.uploadError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadOrganizationPictureRequest, (state) => {
        state.isUploading = true;
        state.uploadError = null;
      })
      .addCase(uploadOrganizationPictureSuccess, (state, action) => {
        state.isUploading = false;
        if (state.currentOrganization) {
          state.currentOrganization.logoImageData = action.payload.logoImageData;
          state.currentOrganization.logoImageContentType = action.payload.logoImageContentType;
        }
        state.showUploadForm = false; // Close the form after successful upload
      })
      .addCase(uploadOrganizationPictureFailure, (state, action) => {
        state.isUploading = false;
        state.uploadError = action.payload;
      });
  }
});

export const {
  fetchOrganizationRequest,
  fetchOrganizationSuccess,
  fetchOrganizationFailure,
  fetchOrganizationsRequest,
  fetchOrganizationsSuccess,
  fetchOrganizationsFailure,
  toggleUploadForm
} = organizationSlice.actions;

export default organizationSlice.reducer;
