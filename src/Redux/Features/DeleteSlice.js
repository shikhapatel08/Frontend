import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Delete Chat ================================= //

export const Delete = createAsyncThunk(
    'delete/Delete',
    async (Id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v2/chatsetting/delete/${Id}`,
                {},
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

const DeleteSlice = createSlice({
    name: 'delete',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(Delete.pending, (state) => {
                state.loading = true;
            })
            .addCase(Delete.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(Delete.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});


export default DeleteSlice.reducer;