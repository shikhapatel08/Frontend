import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const ResetPassword = createAsyncThunk(
    'resetpassword/ResetPassword',
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.put('/api/v1/users/update', userData);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
)

const ResetPasswordSlice = createSlice({
    name: 'resetpassword',
    initialState: {
        error: null,
        loading: false,

    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(ResetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(ResetPassword.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(ResetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default ResetPasswordSlice.reducer;
