import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Pin Chat ================================= //

export const PinedUser = createAsyncThunk(
    'pined/PinedUser',
    async (Id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v2/chatsetting/pin/${Id}`,
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

const PinedSlice = createSlice({
    name: 'pined',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(PinedUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(PinedUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(PinedUser.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});


export default PinedSlice.reducer;