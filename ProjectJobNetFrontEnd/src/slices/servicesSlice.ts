import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
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
  rating?: number;
};

export const fetchServices = createAsyncThunk('services/fetchAll', async () => {
  const res = await fetch(`${API_BASE_URL}/services`);
  if (!res.ok) throw new Error('Failed to fetch services');
  return (await res.json()) as Service[];
});

export const upvoteService = createAsyncThunk(
  'services/upvote',
  async (serviceId: string | number) => {
    const res = await fetch(`${API_BASE_URL}/services/${serviceId}/upvote`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to upvote service');
    return { serviceId };
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState: {
    items: [] as Service[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchServices.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        // Sort by upvotes descending by default
        state.items = action.payload.sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
        state.loading = false;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services';
      })
      .addCase(upvoteService.fulfilled, (state, action) => {
        const service = state.items.find(s => s.id === action.meta.arg);
        if (service) service.upvotes = (service.upvotes ?? 0) + 1;
      });
  },
});

export default servicesSlice.reducer;
