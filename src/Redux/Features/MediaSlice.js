import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

export const GetMedia = createAsyncThunk(
    'media/UploadMedia',
    async ({ limit = 10, page }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v2/user-data/get-media?page=${page}&limit=${limit}`, {
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

export const GetMediaByChatId = createAsyncThunk(
    'media/GetMediaByChatId',
    async ({ chatId, page, limit = 10 }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v2/user-data/get-media-in-chat/${chatId}?page=${page}&limit=${limit}`, {
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

export const GetDocs = createAsyncThunk(
    'media/GetDocs',
    async ({ page, limit = 10 }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v2/user-data/get-docs?page=${page}&limit=${limit}`, {
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

export const GetDocsByChatId = createAsyncThunk(
    'media/GetDocsByChatId',
    async ({ chatId, page, limit = 10 }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v2/user-data/get-docs-in-chat/${chatId}?page=${page}&limit=${limit}`, {
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

export const GetLinks = createAsyncThunk(
    'media/GetLinks',
    async ({ page, limit = 10 }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v2/user-data/get-links?page=${page}&limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v2/user-data/get-links-in-chat/${chatId}?page=${page}&limit=${limit}`, {
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
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(GetMedia.pending, (state) => {
                state.loading = true;
            })
            .addCase(GetMedia.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const Media = action.payload || [];
                if (state.page === 1) {
                    state.Media = Media;
                } else {
                    state.Media = [...state.Media, ...Media];
                }


                if (Media.length < 10) {
                    state.hasMore = false;
                } else {
                    state.page += 1;
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
                const Media = action.payload || [];
                if (state.page === 1) {
                    state.Media = Media;
                } else {
                    state.Media = [...state.Media, ...Media];
                }


                if (Media.length < 10) {
                    state.hasMore = false;
                } else {
                    state.page += 1;
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
                const Docs = action.payload || [];

                if (state.page === 1) {
                    state.Docs = Docs;
                } else {
                    state.Docs = [...state.Docs, ...Docs];
                }

                if (Docs.length < 10) {
                    state.hasMore = false
                } else {
                    state.page += 1;
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
                const Docs = action.payload || [];

                if (state.page === 1) {
                    state.Docs = Docs;
                } else {
                    state.Docs = [...state.Docs, ...Docs];
                }

                if (Docs.length < 10) {
                    state.hasMore = false
                } else {
                    state.page += 1;
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
                const Links = action.payload || [];

                if (state.page === 1) {
                    state.Links = Links;
                } else {
                    state.Links = [...state.Links, ...Links]
                }

                if (Links.length < 10) {
                    state.hasMore = false
                } else {
                    state.page += 1;
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
                const Links = action.payload || [];

                if (state.page === 1) {
                    state.Links = Links;
                } else {
                    state.Links = [...state.Links, ...Links]
                }

                if (Links.length < 10) {
                    state.hasMore = false
                } else {
                    state.page += 1;
                }
            })
            .addCase(GetLinksByChatId.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default MediaSlice.reducer;