import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Profile User ================================= //

export const ProfileUser = createAsyncThunk(
    'profileuser/ProfileUser',
    async (userId, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`${BASE_API}/api/v1/users/profile/${userId}`,
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

const ProfileSlice = createSlice({
    name: 'profileuser',
    initialState: {
        error: null,
        loading: false,
        User: localStorage.getItem('User') ? JSON.parse(localStorage.getItem('User')) : {},
    },
    reducers: {
        setUserFromUpdate: (state, action) => {
        state.User = action.payload;
    }
    },
    extraReducers: (builder) => {
        builder
            .addCase(ProfileUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(ProfileUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.User = action.payload.data[0];
                localStorage.setItem('User', JSON.stringify(action.payload.data[0]));
            })
            .addCase(ProfileUser.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export const { setUserFromUpdate } = ProfileSlice.actions;

export default ProfileSlice.reducer;