import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const DeleteEveryone = createAsyncThunk(
    'deleteEveryone/DeleteEveryone',
    async (msgId, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(`/api/v1/message/delete/all/${msgId}`, {});
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const DeleteEveryoneSlice = createSlice({
    name: 'deleteEveryone',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DeleteEveryone.pending, (state) => {
                state.loading = true;
            })
            .addCase(DeleteEveryone.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(DeleteEveryone.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default DeleteEveryoneSlice.reducer;