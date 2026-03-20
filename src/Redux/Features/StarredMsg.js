import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const GetStarredMsg = createAsyncThunk(
    'starredMsg/StarredMsg',
    async ({ page, limit = 10 }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/v2/messagesetting/get-star-message?page=${page}&limit=${limit}`, {
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

export const StarredMsgChat = createAsyncThunk(
    'starredMsg/StarredMsgChat',
    async ({ chatId, page, limit = 10 }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${API_URL}/api/v1/message/get-star-message-in-chat/${chatId}?page=${page}&limit=${limit}`, {
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

const StarredMsgSlice = createSlice({
    name: 'starredMsg',
    initialState: {
        error: null,
        loading: false,
        starredMessages: [],
        page: 1,
        hasMore: true,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(GetStarredMsg.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetStarredMsg.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const starredMsg = action.payload || [];

                if (state.page === 1) {
                    state.starredMessages = starredMsg;
                } else {
                    state.starredMessages = [...state.starredMessages, ...starredMsg]
                }
                if (state.starredMessages.length < 10) {
                    state.hasMore = false;
                } else {
                    state.page += 1;
                }
            })
            .addCase(GetStarredMsg.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(StarredMsgChat.pending, (state) => {
                state.loading = true;
            })
            .addCase(StarredMsgChat.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const starredMsg = action.payload || [];

                if (state.page === 1) {
                    state.starredMessages = starredMsg;
                } else {
                    state.starredMessages = [...state.starredMessages, ...starredMsg]
                }
                if (state.starredMessages.length < 10) {
                    state.hasMore = false;
                } else {
                    state.page += 1;
                }
            })
            .addCase(StarredMsgChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export default StarredMsgSlice.reducer;