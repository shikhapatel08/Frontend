import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const MuteUser = createAsyncThunk(
    'mute/MuteUser',
    async (Id, thunkAPI) => {
        try {
            const res = await axiosInstance.patch(`/api/v2/chatsetting/mute/${Id}`, {});
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
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