import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const AddUser = createAsyncThunk(
    'signup/AddUser',
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/v1/users/register', userData);
            return res.data;
        } catch (err) {
            return thunkAPI.rejectWithValue({
                status: err.response?.status,
                message: err.response?.data?.message || err.message,
            });
        }
    }
)

const SignUpSlice = createSlice({
    name: 'signup',
    initialState: {
        error: null,
        loading: false,
        token: localStorage.getItem('token') || null,
        SignupUser: localStorage.getItem('SignupUser') ? JSON.parse(localStorage.getItem('SignupUser')) : {},
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(AddUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(AddUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.SignupUser = action.payload.data;
                localStorage.setItem('SignupUser', JSON.stringify(action.payload.data));
                if (action.payload?.token) {
                    state.token = action.payload.token;
                    localStorage.setItem("token", action.payload.token);
                }
            })
            .addCase(AddUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});

export default SignUpSlice.reducer;
