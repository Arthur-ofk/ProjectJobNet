import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  authorName?: string;
};

interface VacancyDetailState {
  vacancy: Vacancy | null;
  loading: boolean;
  error: string | null;
}

const initialState: VacancyDetailState = {
  vacancy: null,
  loading: false,
  error: null,
};

const vacancyDetailSlice = createSlice({
  name: 'vacancyDetail',
  initialState,
  reducers: {
    fetchVacancyDetailRequest(state, action: PayloadAction<{ id: string }>) {
      state.loading = true;
      state.error = null;
    },
    fetchVacancyDetailSuccess(state, action: PayloadAction<Vacancy>) {
      state.vacancy = action.payload;
      state.loading = false;
    },
    fetchVacancyDetailFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    resetVacancyDetail(state) {
      state.vacancy = null;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchVacancyDetailRequest,
  fetchVacancyDetailSuccess,
  fetchVacancyDetailFailure,
  resetVacancyDetail,
} = vacancyDetailSlice.actions;
export default vacancyDetailSlice.reducer;