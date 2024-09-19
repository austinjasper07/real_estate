import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

axios.defaults.withCredentials = true;
const API_URL = "http://localhost:3000/api/user";


export const user_listings = createAsyncThunk('user/user_listings', async () => {
    try {
        const response = await axios.get(`${API_URL}/user_listings`, {});
        return response.data;
    } catch (error) {
         throw new Error(error.message);
    }
})

export const delete_listing = createAsyncThunk("user/delete_listing", async () => {
    try {
        const response = await axios.get(`${API_URL}/delete_listing`);
        return response.data
    } catch (error) {
        throw new Error(error.message);
    }
})
export const edit_listing = createAsyncThunk("user/edit_listing", async () => {
    try {
        const response = await axios.get(`${API_URL}/edit_listing`);
        return response.data
    } catch (error) {
        throw new Error(error.message);
    }
})


const userSlice = createSlice({
    name: "user",
    initialState: {
        listings: [],
        status: "idle",
        error: null,
        message: null
    },
    reducers: {
        reset(state) {
            state.status = "idle";
            state.error = null;
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(user_listings.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(user_listings.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.listings = action.payload.listings;
                state.error = null;
                state.message = action.payload.message
            })
            .addCase(user_listings.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.message;
            })
            .addCase(delete_listing.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(delete_listing.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.listings = action.payload.listings;
                state.error = null;
                state.message = action.payload.message
            })
            .addCase(delete_listing.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.message;
            })
            .addCase(edit_listing.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(edit_listing.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.listings = action.payload.listings;
                state.error = null;
                state.message = action.payload.message
            })
            .addCase(edit_listing.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload.message;
            })
            
    }
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
