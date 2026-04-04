import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const FetchAllUser = createAsyncThunk(
    'alluser/FetchAllUser',
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get(`/api/v1/users/getall`);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
)
const FetchAllUserSlice = createSlice({
    name: 'alluser',
    initialState: {
        error: null,
        loading: false,
        User: localStorage.getItem('AllUser') ? JSON.parse(localStorage.getItem('AllUser')) : [],
    },
    reducers: {
        setUserFromUpdate: (state, action) => {
            state.User = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(FetchAllUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(FetchAllUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.User = action.payload.data;
                localStorage.setItem('AllUser', JSON.stringify(action.payload.data));
            })
            .addCase(FetchAllUser.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export const { setUserFromUpdate } = FetchAllUserSlice.actions;

export default FetchAllUserSlice.reducer;