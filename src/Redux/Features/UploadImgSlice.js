import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Upload Image ================================= //

export const UploadImg = createAsyncThunk(
    'uploading/UploadImg',
    async (formdata, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${BASE_API}/api/v1/users/upload`, formdata,
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

const UploadImgSlice = createSlice({
    name: 'uploading',
    initialState: {
        error: null,
        loading: false,
        data:[],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(UploadImg.pending, (state) => {
                state.loading = true;
            })
            .addCase(UploadImg.fulfilled, (state,action) => {
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