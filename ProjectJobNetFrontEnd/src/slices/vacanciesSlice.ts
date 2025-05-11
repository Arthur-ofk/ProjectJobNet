import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { API_BASE_URL } from '../constants.ts';

export type Vacancy = {
  id: string;
  title: string;
  description: string;
  salary: number;
  location: string;
  categoryId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const fetchVacancies = createAsyncThunk('vacancies/fetchAll', async () => {
  const res = await fetch(`${API_BASE_URL}/jobs`);
  if (!res.ok) throw new Error('Failed to fetch vacancies');
  return (await res.json()) as Vacancy[];
});

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState: {
    items: [] as Vacancy[],
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchVacancies.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchVacancies.fulfilled, (state, action) => {
        state.items = action.payload;
        state.loading = false;
      })
      .addCase(fetchVacancies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch vacancies';
      });
  },
});

export default vacanciesSlice.reducer;
