import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosInstance";

export const ProfileUser = createAsyncThunk(
    'profileuser/ProfileUser',
    async (_, thunkAPI) => {
        try {
            const res = await axiosInstance.get('/api/v1/users/profile');
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message,
            });
        }
    }
);
export const AnotherUserProfile = createAsyncThunk(
    'profileuser/AnotherUserProfile',
    async (userId, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/v1/users/other-user-profile', {
                id: userId
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
