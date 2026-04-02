import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API = import.meta.env.VITE_API_URL;


export const sendReaction = createAsyncThunk(
    "Emoji/EmojiSlice",
    async ({ messageId, emoji }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${BASE_API}/api/v3/reaction/react`,
                {
                    msgId: messageId,
                    emoji: emoji
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            const errMsg =
                error?.response?.data?.message ||
                error?.response?.data?.msg ||
                error?.message ||
                "Something went wrong";

            toast.error(errMsg);
            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
        }
    }
)

const emojiSlice = createSlice({
    name: "Emoji",
    initialState: {
        emoji: [],
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendReaction.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendReaction.fulfilled, (state, action) => {
                state.loading = false;
                state.emoji = action.payload;
            })
            .addCase(sendReaction.rejected, (state) => {
                state.loading = false;
            })
    }
});

// export const { setReactionLocal } = emojiSlice.actions;
export default emojiSlice.reducer;
