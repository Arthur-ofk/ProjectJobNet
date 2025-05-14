import { createSlice, PayloadAction } from '@reduxjs/toolkit';
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

type VacanciesState = {
  items: Vacancy[];
  loading: boolean;
  error: string | null;
};

const initialState: VacanciesState = {
  items: [],
  loading: false,
  error: null,
};

const vacanciesSlice = createSlice({
  name: 'vacancies',
  initialState,
  reducers: {
    fetchVacanciesRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchVacanciesSuccess(state, action: PayloadAction<Vacancy[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchVacanciesFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { fetchVacanciesRequest, fetchVacanciesSuccess, fetchVacanciesFailure } = vacanciesSlice.actions;
export default vacanciesSlice.reducer;
