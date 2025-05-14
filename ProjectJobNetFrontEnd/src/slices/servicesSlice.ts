import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../constants.ts';

export type Service = {
  id: number | string;
  title: string;
  description: string;
  providerName: string;
  providerId: string;
  price: number;
  tags?: string[];
  upvotes: number;
  downvotes?: number;
  rating?: number;
};

type ServicesState = {
  items: Service[];
  loading: boolean;
  error: string | null;
};

const initialState: ServicesState = {
  items: [],
  loading: false,
  error: null,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    fetchServicesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchServicesSuccess(state, action: PayloadAction<Service[]>) {
      state.items = action.payload.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
      state.loading = false;
    },
    fetchServicesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    upvoteServiceRequested(state, action: PayloadAction<string | number>) {
      // no change needed here; saga will process
    },
    upvoteServiceSuccess(state, action: PayloadAction<{ serviceId: string | number }>) {
      const service = state.items.find(s => s.id === action.payload.serviceId);
      if (service) service.upvotes = (service.upvotes ?? 0) + 1;
    },
    downvoteServiceRequested(state, action: PayloadAction<string | number>) {
      // no change needed here; saga will process
    },
    downvoteServiceSuccess(state, action: PayloadAction<{ serviceId: string | number }>) {
      const service = state.items.find(s => s.id === action.payload.serviceId);
      if (service) service.downvotes = (service.downvotes ?? 0) + 1;
    },
  },
});

export const {
  fetchServicesRequest,
  fetchServicesSuccess,
  fetchServicesFailure,
  upvoteServiceRequested,
  upvoteServiceSuccess,
  downvoteServiceRequested,
  downvoteServiceSuccess,
} = servicesSlice.actions;
export default servicesSlice.reducer;
