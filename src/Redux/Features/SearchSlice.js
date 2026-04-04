import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const Searching = createAsyncThunk(
    'search/Searching',
    async ({ name, limit = 4 }, thunkAPI) => {
        const token = localStorage.getItem('token');
        try {
            const res = await axiosInstance.get('/api/v1/users/search', {
                params: {
                    name,
                    limit
                }
            });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
)

const SearchSlice = createSlice({
    name: 'search',
    initialState: {
        loading: false,
        error: null,
        data: [],
    },
    reducers: {
        clearSearch: (state) => {
            state.data = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(Searching.pending, (state) => {
                state.loading = true;
            })
            .addCase(Searching.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload?.data) {
                    state.data = action.payload?.data;
                } else {
                    state.data = [];
                }
            })
            .addCase(Searching.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
});

export const { clearSearch } = SearchSlice.actions;

export default SearchSlice.reducer;
