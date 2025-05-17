import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Notification = {
  id: string;
  status: string;
  authorId?: string;
  customerId?: string;
  serviceId?: string;
  authorConfirmed?: boolean;
  customerConfirmed?: boolean;
};

type NotificationsState = {
  items: Notification[];
  loading: boolean;
  error: string | null;
};

const initialState: NotificationsState = {
  items: [],
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    fetchNotificationsRequest(state, action: PayloadAction<{ userId: string; token: string }>) {
      state.loading = true;
      state.error = null;
    },
    fetchNotificationsSuccess(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
      state.loading = false;
    },
    fetchNotificationsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearNotifications(state) {
      state.items = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  fetchNotificationsRequest,
  fetchNotificationsSuccess,
  fetchNotificationsFailure,
  clearNotifications,
} = notificationsSlice.actions;
export default notificationsSlice.reducer;
