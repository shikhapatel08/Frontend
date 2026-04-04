import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const DeleteProfile = createAsyncThunk(
    'deleteprofile/DeleteProfile',
    async (userData, thunkAPI) => {
        try {
            const res = await axiosInstance.delete('/api/v1/users/delete', {
                data: userData
            });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)

const DeleteProfileSlice = createSlice({
    name: 'deleteprofile',
    initialState: {
        error: null,
        loading: false,

    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DeleteProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(DeleteProfile.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(DeleteProfile.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default DeleteProfileSlice.reducer;