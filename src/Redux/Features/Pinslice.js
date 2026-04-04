import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const PinedUser = createAsyncThunk(
    'pined/PinedUser',
    async (Id, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(`/api/v2/chatsetting/pin/${Id}`, {});
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
)

const PinedSlice = createSlice({
    name: 'pined',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(PinedUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(PinedUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(PinedUser.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});


export default PinedSlice.reducer;