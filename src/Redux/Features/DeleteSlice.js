import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const Delete = createAsyncThunk(
    'delete/Delete',
    async (Id, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(`/api/v2/chatsetting/delete/${Id}`, {});
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const DeleteSlice = createSlice({
    name: 'delete',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(Delete.pending, (state) => {
                state.loading = true;
            })
            .addCase(Delete.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(Delete.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});


export default DeleteSlice.reducer;