import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const GIF_API_KEY = import.meta.env.VITE_GIF_API_KEY;

export const FetchGif = createAsyncThunk(
    "gif/fetchGif",
    async (query, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `https://api.giphy.com/v1/gifs/search?api_key=${GIF_API_KEY}&q=${query}&limit=12&rating=g`
            );

            const formattedData = response.data.data.map((gif) => ({
                id: gif.id,
                media_formats: {
                    tinygif: { url: gif.images.fixed_height_small.url },
                    gif: { url: gif.images.fixed_height.url }
                },
                content_description: gif.title
            }));

            return formattedData;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error fetching GIFs from Giphy");
        }
    }
);

export const GifSlice = createSlice({
    name: "gif",
    initialState: {
        gifs: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearGif: (state) => {
            state.gifs = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchGif.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(FetchGif.fulfilled, (state, action) => {
                state.loading = false;
                state.gifs = action.payload;
            })
            .addCase(FetchGif.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearGif } = GifSlice.actions;
export default GifSlice.reducer;