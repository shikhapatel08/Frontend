import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_API = import.meta.env.VITE_API_URL;

export const shortenMessageText = createAsyncThunk(
    "textFunctionally/TextFunctionally",
    async (text) => {
        const token = localStorage.getItem("token");
        try {
            const response = await axios.post(`${BASE_API}/api/v3/ai/generate-short-explanation`,
                {
                    text: text
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            const err = error.response.data.message;
            toast.error(err);
            return err;
        }
    }
)

const TextFunctionallySlice = createSlice({
    name: "textFunctionally",
    initialState: {
        textFunctionally: [],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(shortenMessageText.pending, (state) => {
                state.loading = true;
            })
            .addCase(shortenMessageText.fulfilled, (state, action) => {
                state.loading = false;
                state.textFunctionally = action.payload;
            })
            .addCase(shortenMessageText.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
    }
})

export default TextFunctionallySlice.reducer;