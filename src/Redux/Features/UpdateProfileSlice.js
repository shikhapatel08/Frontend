import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const UpdateUser = createAsyncThunk(
    'updateprofile/UpdateUser',
    async ({ data, type }, thunkAPI) => {
        try {
            const res = await axiosInstance.put('/api/v1/users/update', {
                ...data,
                action: type,
            });
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
)

const UpdateProfileSlice = createSlice({
    name: 'updateprofile',
    initialState: {
        error: null,
        loading: false,
        currentAction: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(UpdateUser.pending, (state, action) => {
                state.loading = true;
                state.currentAction = action.meta.arg.type;
            })
            .addCase(UpdateUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.currentAction = null;
            })
            .addCase(UpdateUser.rejected, (state, action) => {
                state.loading = false;
                state.currentAction = null;
                state.error = action.payload;
            })
    },
});

export default UpdateProfileSlice.reducer;
