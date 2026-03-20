import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Mute User ================================= //

export const MuteUser = createAsyncThunk(
    'mute/MuteUser',
    async (Id, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v2/chatsetting/mute/${Id}`,
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

const MuteSlice = createSlice({
    name: 'mute',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(MuteUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(MuteUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(MuteUser.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});


export default MuteSlice.reducer;