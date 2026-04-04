import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";


export const FetchNotifications = createAsyncThunk(
    'notification/FetchNotifications',
    async ({ page, limit = 10 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/api/v2/notification/get-all', {
                params: {
                    page,
                    limit
                }
            });
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
);

export const SeenNotification = createAsyncThunk(
    'notification/SeenNotification',
    async (id, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/api/v2/notification/get-all', {
                params: {
                    page,
                    limit
                }
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
            const res = await axiosInstance.delete(`/api/v2/notification/delete/${id}`);
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
        resetNotifications: (state) => {
            state.notifications = [];
            state.page = 1;
            state.hasMore = true;
            state.error = null;
        },
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
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 10);

                const newNotifications = action.payload || [];

                const allNotifications = requestPage === 1
                    ? newNotifications
                    : [...state.notifications, ...newNotifications];

                const dedupedNotifications = Array.from(
                    new Map(allNotifications.map(n => [n.id, n])).values()
                );

                state.notifications = dedupedNotifications;

                state.hasMore = newNotifications.length >= requestLimit;
                state.page = requestPage + 1;
            })
            .addCase(FetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(SeenNotification.pending, (state) => {
                state.loading = true;
            })
            .addCase(SeenNotification.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(SeenNotification.rejected, (state, action) => {
                state.loading = false;
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
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { resetNotifications, DeleteNoti, AddNotification } = NotificationSlice.actions;

export default NotificationSlice.reducer;
