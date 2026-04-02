import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ================================= Search Messages ================================= //

export const SearchMsg = createAsyncThunk(
    'searchMsg/SearchMsg',
    async ({ chatId, searchTerm, page, limit = 20 }, thunkAPI) => {
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
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
);

const SearchMsgSlice = createSlice({
    name: 'searchMsg',
    initialState: {
        error: null,
        loading: false,
        searchResults: [],
        currentIndex: 0,
        totalResults: 0,
        scrollToMsgId: null,
        selectedMessageId: null,
        page: 1,
        hasMore: true,
    },
    reducers: {
        ClearSearchResults: (state) => {
            state.searchResults = [];
            state.page = 1;
            state.hasMore = true;
            state.error = null;
        },
        ScrollToMsg: (state, action) => {
            state.scrollToMsgId = action.payload;
        },
        clearScrollToMsg: (state) => {
            state.scrollToMsgId = null;
        },
        SelectedMessage: (state, action) => {
            state.selectedMessageId = action.payload;
        },
        UpdateSearchResult: (state, action) => {
            state.searchResults = action.payload;
        },
        UpdatecurrentIndex: (state, action) => {
            state.currentIndex = action.payload;
        },
        UpdateTotalResults: (state, action) => {
            state.totalResults = action.payload;
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
                const requestPage = Number(action.meta.arg?.page || 1);
                const requestLimit = Number(action.meta.arg?.limit || 20);
                const searchResults = action.payload?.msg || [];

                if (requestPage === 1) {
                    state.searchResults = searchResults;
                } else {
                    state.searchResults = [...state.searchResults, ...searchResults]
                }

                if (searchResults.length < requestLimit) {
                    state.hasMore = false;
                    state.page = requestPage;
                } else {
                    state.hasMore = true;
                    state.page = requestPage + 1;
                }
            })
            .addCase(SearchMsg.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export const { ClearSearchResults, ScrollToMsg, clearScrollToMsg, SelectedMessage, UpdateSearchResult, UpdatecurrentIndex, UpdateTotalResults } = SearchMsgSlice.actions;
export default SearchMsgSlice.reducer;
