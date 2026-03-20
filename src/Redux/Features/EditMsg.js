import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const EditMsg = createAsyncThunk(
    'message/EditMsg',
    async ({ msgId, text, chatId }, thunkAPI) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/v1/message/chat/${chatId}/edit-message/${msgId}`,
                {
                    text
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);


const EditMsgSlice = createSlice({
    name: 'EditMsg',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(EditMsg.pending, (state) => {
                state.loading = true;
            })
            .addCase(EditMsg.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(EditMsg.rejected, (state, action) => {
                state.error = action.payload;
            })
    }
});

export default EditMsgSlice.reducer;