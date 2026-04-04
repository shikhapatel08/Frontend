import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";

export const sendReaction = createAsyncThunk(
    "Emoji/EmojiSlice",
    async ({ messageId, emoji }, thunkAPI) => {
        try {
            const res = await axiosInstance.post('/api/v3/reaction/react', {
                msgId: messageId,
                emoji: emoji
            });
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

export default emojiSlice.reducer;
