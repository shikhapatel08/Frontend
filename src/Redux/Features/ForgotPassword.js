import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Forgot Password ================================= //

export const ForgotPassword = createAsyncThunk(
    "forgotPassword/ForgotPassword",
    async ({ email, newPass }, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_API}/api/v1/users/forgot-password`, { email, newPass });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
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