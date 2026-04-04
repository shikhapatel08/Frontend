import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const LogoutUser = createAsyncThunk(
    'logout/LogoutUser',
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/v1/users/logout', {});
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
)

const LogoutSlice = createSlice({
    name: 'logout',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(LogoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(LogoutUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(LogoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    },
});


export default LogoutSlice.reducer;
