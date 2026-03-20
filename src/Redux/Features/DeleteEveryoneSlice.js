import { createAsyncThunk ,createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// ================================= Delete Message for Everyone ================================= //

const BASE_API = import.meta.env.VITE_API_URL;
export const DeleteEveryone = createAsyncThunk(
    'deleteEveryone/DeleteEveryone',
    async (msgId, thunkAPI) => {   
        try {
            const token = localStorage.getItem('token');
            const res = await axios.patch(`${BASE_API}/api/v1/message/delete/all/${msgId}`,
                {},
                {
                    headers: {  
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return res.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(error.message);
        }
    }
);

const DeleteEveryoneSlice = createSlice({
    name: 'deleteEveryone',
    initialState: {
        error: null,
        loading: false,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DeleteEveryone.pending, (state) => {
                state.loading = true;
            })
            .addCase(DeleteEveryone.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(DeleteEveryone.rejected, (state, action) => {
                state.error = action.payload;
            })  
    },
}); 

export default DeleteEveryoneSlice.reducer;