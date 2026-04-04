import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const BlockedUser = createAsyncThunk(
    'blocked/BlockedUser',
    async (Id, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(`/api/v2/chatsetting/block/${Id}`, {});
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