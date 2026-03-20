import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ================================= Delete Message for Me ================================= //

const BASE_API = import.meta.env.VITE_API_URL;
export const DeleteMe = createAsyncThunk(
    'deleteMe/DeleteMe',
    async (msgId, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v2/messagesetting/delete-for-me/${msgId}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const DeleteMeSlice = createSlice({
    name: 'deleteMe',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DeleteMe.pending, (state) => {
                state.loading = true;
            })
            .addCase(DeleteMe.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(DeleteMe.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default DeleteMeSlice.reducer;