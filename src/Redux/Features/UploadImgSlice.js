import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const UploadImg = createAsyncThunk(
    'uploading/UploadImg',
    async (formdata, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/v1/users/upload', formdata);
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
)

const UploadImgSlice = createSlice({
    name: 'uploading',
    initialState: {
        error: null,
        loading: false,
        data: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(UploadImg.pending, (state) => {
                state.loading = true;
            })
            .addCase(UploadImg.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.data = action.payload;
            })
            .addCase(UploadImg.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default UploadImgSlice.reducer;