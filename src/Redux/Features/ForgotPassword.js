import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const ForgotPassword = createAsyncThunk(
    "forgotPassword/ForgotPassword",
    async ({ email, newPass }, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/v1/users/forgot-password', {
                email,
                newPass
            });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }

    });

const ForgotPasswordSlice = createSlice({
    name: "forgotPassword",
    initialState: {
        loading: false,
        error: null,
        forgotPasswordData: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(ForgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(ForgotPassword.fulfilled, (state, action) => {
                state.loading = false;
                state.forgotPasswordData = action.payload;
            }
            )
            .addCase(ForgotPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to send OTP";
            })
    },
});

export default ForgotPasswordSlice.reducer;