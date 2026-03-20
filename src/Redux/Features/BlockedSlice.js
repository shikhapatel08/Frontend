import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;
// ================================= Block User ================================= //
export const BlockedUser = createAsyncThunk(
    'blocked/BlockedUser',
    async (Id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v2/chatsetting/block/${Id}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const BlockedSlice = createSlice({
    name: 'blocked',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(BlockedUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(BlockedUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(BlockedUser.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});


export default BlockedSlice.reducer;