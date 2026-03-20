import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Update Profile ================================= //

export const UpdateUser = createAsyncThunk(
    'updateprofile/UpdateUser',
    async ({data,type}, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`${BASE_API}/api/v1/users/update`,
                {
                    ...data,
                    action : type,
                },
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

const UpdateProfileSlice = createSlice({
    name: 'updateprofile',
    initialState: {
        error: null,
        loading: false,
        currentAction:null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(UpdateUser.pending, (state,action) => {
                state.loading = true;
                state.currentAction = action.meta.arg.type;
            })
            .addCase(UpdateUser.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
                state.currentAction = null;
            })
            .addCase(UpdateUser.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export default UpdateProfileSlice.reducer;