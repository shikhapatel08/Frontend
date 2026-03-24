import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_API = import.meta.env.VITE_API_URL;

// ================================= Profile User ================================= //
const token = localStorage.getItem('token');

export const ProfileUser = createAsyncThunk(
    'profileuser/ProfileUser',
    async (thunkAPI) => {
        try {
            const res = await axios.get(`${BASE_API}/api/v1/users/profile`,
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
);
export const AnotherUserProfile = createAsyncThunk(
    'profileuser/AnotherUserProfile',
    async (userId, thunkAPI) => {
        try {
            const res = await axios.post(`${BASE_API}/api/v1/users/other-user-profile`,
                {
                    id: userId
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
            return res.data;
        } catch {
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
        AnotherUser: {},
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
                state.User = action.payload.data;
                localStorage.setItem("User", JSON.stringify(action.payload.data))
            })
            .addCase(ProfileUser.rejected, (state, action) => {
                state.error = action.payload;
            })

            .addCase(AnotherUserProfile.pending, (state) => {
                state.loading = true;
            })
            .addCase(AnotherUserProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.AnotherUser = action.payload.data;
            })
            .addCase(AnotherUserProfile.rejected, (state, action) => {
                state.error = action.payload;
            })
    },
});

export const { setUserFromUpdate } = ProfileSlice.actions;

export default ProfileSlice.reducer;