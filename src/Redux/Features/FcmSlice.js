import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    fcmToken: null,
    status: "idle",
    error: null,
};

const BASE_API = import.meta.env.VITE_API_URL;

export const getFcmToken = createAsyncThunk(
    "fcm/getFcmToken",
    async (fcm_token, { rejectWithValue }) => {
        const authToken = localStorage.getItem("token");

        try {
            const response = await axios.put(
                `${BASE_API}/api/v1/users/update-fcm`,
                {
                    fcm_token: fcm_token,
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            return response.data; // only data
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