import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

export const FetchNotifications = createAsyncThunk(
    'notification/FetchNotifications',
    async ({ page, limit = 10 }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v2/notification/get-all?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const SeenNotification = createAsyncThunk(
    'notification/SeenNotification',
    async (id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v2/notification/seen/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const DeleteNotification = createAsyncThunk(
    'notification/DeleteNotification',
    async (id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${BASE_API}/api/v2/notification/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    });

const NotificationSlice = createSlice({
    name: 'notification',
    initialState: {
        error: null,
        loading: false,
        notifications: [],
        page: 1,
        hasMore: true,
    },
    reducers: {
        DeleteNoti: (state, action) => {
            const deletedId = action.payload;
            state.notifications = state.notifications.filter(notification => notification.id !== deletedId);
        },
        AddNotification: (state, action) => {
            state.notifications.unshift(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const newNotifications = action.payload || [];
                if (state.page === 1) {
                    state.notifications = newNotifications;
                } else {
                    state.notifications = [...state.notifications, ...newNotifications];
                }
                if (state.notifications.length < 10) {
                    state.hasMore = false;
                } else {
                    state.page += 1;
                }
            })
            .addCase(FetchNotifications.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(SeenNotification.pending, (state) => {
                state.loading = true;
            })
            .addCase(SeenNotification.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                // const updatedNotification = action.payload;
                // state.notifications = state.notifications.map(notification =>
                //     notification.id === updatedNotification.id ? updatedNotification : notification
                // );
            })
            .addCase(SeenNotification.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(DeleteNotification.pending, (state) => {
                state.loading = true;
            })
            .addCase(DeleteNotification.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const deletedId = action.payload.id;
                state.notifications = state.notifications.filter(notification => notification.id !== deletedId);
            })
            .addCase(DeleteNotification.rejected, (state, action) => {
                state.error = action.payload;
            })
    }
});

export const { DeleteNoti, AddNotification } = NotificationSlice.actions;

export default NotificationSlice.reducer;