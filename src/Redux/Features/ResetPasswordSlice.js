import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Reset Password ================================= //

export const ResetPassword = createAsyncThunk(
    'resetpassword/ResetPassword',
    async (userData, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${BASE_API}/api/v1/users/update`, userData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
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
                state.error = action.payload;
            })
    },
});

export default ResetPasswordSlice.reducer;