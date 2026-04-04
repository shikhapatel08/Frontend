import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

const initialState = {
    fcmToken: null,
    status: "idle",
    error: null,
};


export const getFcmToken = createAsyncThunk(
    "fcm/getFcmToken",
    async (fcm_token, { rejectWithValue }) => {

        try {
            const response = await axiosInstance.put(
                '/api/v1/users/update-fcm',
                { fcm_token: fcm_token }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Error");
        }
    }
);

const fcmSlice = createSlice({
    name: "fcm",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getFcmToken.pending, (state) => {
                state.status = "loading";
            })
            .addCase(getFcmToken.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.fcmToken = action.payload;
            })
            .addCase(getFcmToken.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export default fcmSlice.reducer;