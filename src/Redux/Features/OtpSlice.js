import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= OTP Actions ================================= //

export const SendOtp = createAsyncThunk(
    "otp/sendOtp",
    async ({ email , action}, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_API}/api/v1/users/send-otp`, { 
                email,
                action : action
            });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);

// ================================= Verify OTP Actions ================================= //

export const verifyOtp = createAsyncThunk(
    "otp/verifyOtp",
    async ({email , otp}, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_API}/api/v1/users/verify-otp`, { email, otp });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response.data);
        }
    }
);


const OtpSlice = createSlice({
    name: "otp",
    initialState: {
        loading: false,
        error: null,
        otpData: null,
        token: localStorage.getItem('token') || null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder

            .addCase(SendOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(SendOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpData = action.payload;
            })
            .addCase(SendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to send OTP";
            })

            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.otpData = action.payload;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to verify OTP";
            })
    }
});

export default OtpSlice.reducer;