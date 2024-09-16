import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = `${import.meta.env.API_URL}/listing`;

export const createListing = createAsyncThunk(
  "listing/createLisiting",
  async (formData) => {
    try {
      const response = await axios.post("http://localhost:3000/api/listing/create", formData);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }
);

const listingSlice = createSlice({
  name: "listing",
  initialState: {
    status: "idle",
    allListings: null,
    error: null,
    singleListing: null,
    message: null,
  },
  reducers: {
    reset(state) {
      state.status = "idle";
      state.message = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createListing.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createListing.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.singleListing = action.payload.property;
        state.message = action.payload.message;
      })
      .addCase(createListing.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});
export const {reset} = listingSlice.actions
export default listingSlice.reducer;
