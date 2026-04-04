import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";


export const GetMedia = createAsyncThunk(
    'media/UploadMedia',
    async ({ limit = 10, page }, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/api/v2/user-data/get-media', {
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

export const GetMediaByChatId = createAsyncThunk(
    'media/GetMediaByChatId',
    async ({ chatId, page, limit = 10 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/api/v2/user-data/get-media-in-chat/${chatId}`, {
                params: {
                    page,
                    limit
                }
            });
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const GetDocs = createAsyncThunk(
    'media/GetDocs',
    async ({ page, limit = 10 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/api/v2/user-data/get-docs', {
                params: {
                    page,
                    limit
                }
            });
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const GetDocsByChatId = createAsyncThunk(
    'media/GetDocsByChatId',
    async ({ chatId, page, limit = 10 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/api/v2/user-data/get-docs-in-chat/${chatId}`, {
                params: {
                    page,
                    limit
                }
            });
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const GetLinks = createAsyncThunk(
    'media/GetLinks',
    async ({ page, limit = 10 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/api/v2/user-data/get-links', {
                params: {
                    page,
                    limit
                }
            });
            return res.data.data;
        }
        catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

export const GetLinksByChatId = createAsyncThunk(
    'media/GetLinksByChatId',
    async ({ chatId, page, limit = 10 }, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/api/v2/user-data/get-links-in-chat/${chatId}`, {
                params: {
                    page,
                    limit
                }
            });
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const MediaSlice = createSlice({
    name: 'media',
    initialState: {
        error: null,
        loading: false,
        Media: [],
        Docs: [],
        Links: [],
        page: 1,
        hasMore: true,
    },
    reducers: {
        resetMediaState: (state) => {
            state.error = null;
            state.loading = false;
            state.Media = [];
            state.Docs = [];
            state.Links = [];
            state.page = 1;
            state.hasMore = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(GetMedia.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetMedia.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 10);
                const Media = action.payload || [];
                if (requestPage === 1) {
                    state.Media = Media;
                } else {
                    state.Media = [...state.Media, ...Media];
                }


                if (Media.length < requestLimit) {
                    state.hasMore = false;
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
                }
            })

            .addCase(GetMedia.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(GetMediaByChatId.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetMediaByChatId.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 10);
                const Media = action.payload || [];
                if (requestPage === 1) {
                    state.Media = Media;
                } else {
                    state.Media = [...state.Media, ...Media];
                }


                if (Media.length < requestLimit) {
                    state.hasMore = false;
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
                }
            })
            .addCase(GetMediaByChatId.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(GetDocs.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetDocs.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 10);
                const Docs = action.payload || [];

                if (requestPage === 1) {
                    state.Docs = Docs;
                } else {
                    state.Docs = [...state.Docs, ...Docs];
                }

                if (Docs.length < requestLimit) {
                    state.hasMore = false
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
                }
            })
            .addCase(GetDocs.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(GetDocsByChatId.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetDocsByChatId.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 10);
                const Docs = action.payload || [];

                if (requestPage === 1) {
                    state.Docs = Docs;
                } else {
                    state.Docs = [...state.Docs, ...Docs];
                }

                if (Docs.length < requestLimit) {
                    state.hasMore = false
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
                }
            })
            .addCase(GetDocsByChatId.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(GetLinks.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetLinks.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 10);
                const Links = action.payload || [];

                if (requestPage === 1) {
                    state.Links = Links;
                } else {
                    state.Links = [...state.Links, ...Links]
                }

                if (Links.length < requestLimit) {
                    state.hasMore = false
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
                }
            })
            .addCase(GetLinks.rejected, (state, action) => {
                state.error = action.payload;
            })
            .addCase(GetLinksByChatId.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetLinksByChatId.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 10);
                const Links = action.payload || [];

                if (requestPage === 1) {
                    state.Links = Links;
                } else {
                    state.Links = [...state.Links, ...Links]
                }

                if (Links.length < requestLimit) {
                    state.hasMore = false
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
                }
            })
            .addCase(GetLinksByChatId.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export const { resetMediaState } = MediaSlice.actions;
export default MediaSlice.reducer;
