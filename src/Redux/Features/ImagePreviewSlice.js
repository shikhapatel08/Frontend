import { createSlice } from "@reduxjs/toolkit";

const imagePreviewSlice = createSlice({
  name: "imagePreview",
  initialState: {
    isOpen: false,
    imageUrl: "",
  },
  reducers: {
    openPreview: (state, action) => {
      state.isOpen = true;
      state.imageUrl = action.payload;
    },
    closePreview: (state) => {
      state.isOpen = false;
      state.imageUrl = "";
    },
  },
});

export const { openPreview, closePreview } = imagePreviewSlice.actions;
export default imagePreviewSlice.reducer;
