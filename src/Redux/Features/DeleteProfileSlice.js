import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Delete Profile ================================= //

export const DeleteProfile = createAsyncThunk(
    'deleteprofile/DeleteProfile',
    async (userData, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.delete(`${BASE_API}/api/v1/users/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    data:userData,
                }
            );
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