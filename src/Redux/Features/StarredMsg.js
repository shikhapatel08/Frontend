import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";


export const GetStarredMsg = createAsyncThunk(
    'starredMsg/StarredMsg',
    async ({ page, limit = 10 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/api/v2/messagesetting/get-star-message', {
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

export const StarredMsgChat = createAsyncThunk(
    'starredMsg/StarredMsgChat',
    async ({ chatId, page, limit = 10 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/api/v1/message/get-star-message-in-chat/${chatId}`, {
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

const StarredMsgSlice = createSlice({
    name: 'starredMsg',
    initialState: {
        error: null,
        loading: false,
        starredMessages: [],
        page: 1,
        hasMore: true,
    },
    reducers: {
        resetStarredState: (state) => {
            state.error = null;
            state.loading = false;
            state.starredMessages = [];
            state.page = 1;
            state.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetStarredMsg.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetStarredMsg.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 10);
                const starredMsg = action.payload || [];

                if (requestPage === 1) {
                    state.starredMessages = starredMsg;
                } else {
                    state.starredMessages = [...state.starredMessages, ...starredMsg]
                }

                if (starredMsg.length < requestLimit) {
                    state.hasMore = false;
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
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
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 10);
                const starredMsg = action.payload || [];

                if (requestPage === 1) {
                    state.starredMessages = starredMsg;
                } else {
                    state.starredMessages = [...state.starredMessages, ...starredMsg]
                }

                if (starredMsg.length < requestLimit) {
                    state.hasMore = false;
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
                }
            })
            .addCase(StarredMsgChat.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { resetStarredState } = StarredMsgSlice.actions;
export default StarredMsgSlice.reducer;