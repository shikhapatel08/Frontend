import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import axiosInstance from "../../utils/axiosInstance";

const BASE_API = import.meta.env.VITE_API_URL;


export const FetchUser = createAsyncThunk(
    'signin/FetchUser',
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/v1/users/login', userData);

            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue({
                status: err.response?.status,
                message: err.response?.data?.message,
            });
        }
    }
);
const SignInSlice = createSlice({
    name: 'signin',
    initialState: {
        error: null,
        loading: false,
        token: localStorage.getItem('token') || null,
        SigninUser: localStorage.getItem('SigninUser') ? JSON.parse(localStorage.getItem('SigninUser')) : {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(FetchUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.token = action.payload.token;
                state.SigninUser = action.payload.user;
                localStorage.setItem('SigninUser', JSON.stringify(action.payload.user));
                localStorage.setItem('token', action.payload.token);
            })
            .addCase(FetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default SignInSlice.reducer;
