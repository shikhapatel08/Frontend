import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const DeleteMe = createAsyncThunk(
    'deleteMe/DeleteMe',
    async (msgId, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(`/api/v2/messagesetting/delete-for-me/${msgId}`, {});
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const DeleteMeSlice = createSlice({
    name: 'deleteMe',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DeleteMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(DeleteMe.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(DeleteMe.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default DeleteMeSlice.reducer;