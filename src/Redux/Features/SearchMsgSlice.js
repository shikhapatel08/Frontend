import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ================================= Search Messages ================================= //

export const SearchMsg = createAsyncThunk(
    'searchMsg/SearchMsg',
    async ({ chatId, searchTerm, page, limit = 10 }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/v1/message/search/msg?chatId=${chatId}&text=${searchTerm}&page=${page}&limit=${limit}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,

                    },
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const SearchMsgSlice = createSlice({
    name: 'searchMsg',
    initialState: {
        error: null,
        loading: false,
        searchResults: [],
        scrollToMsgId: null,
        selectedMessageId: null,
        page: 1,
        hasMore: true,
    },
    reducers: {
        ClearSearchResults: (state) => {
            state.searchResults = [];
        },
        ScrollToMsg: (state, action) => {
            state.scrollToMsgId = action.payload;
        },
        clearScrollToMsg: (state) => {
            state.scrollToMsgId = null;
        },
        SelectedMessage: (state, action) => {
            state.selectedMessageId = action.payload;   
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(SearchMsg.pending, (state) => {
                state.loading = true;
            })
            .addCase(SearchMsg.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                const searchResults = action.payload?.msg;

                if (state.page === 1) {
                    state.searchResults = searchResults;
                } else {
                    state.searchResults = [...state.searchResults, ...searchResults]
                }

                if (searchResults.length < 10) {
                    state.hasMore = false;
                } else {
                    state.page += 1;
                }
            })
            .addCase(SearchMsg.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export const { ClearSearchResults, ScrollToMsg, clearScrollToMsg, SelectedMessage } = SearchMsgSlice.actions;
export default SearchMsgSlice.reducer;