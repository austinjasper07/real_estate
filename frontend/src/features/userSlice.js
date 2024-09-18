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


const userSlice = createSlice({
    name: "user",
    initialState: {
        listings: null,
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
                console.log("I am loading")
            })
            .addCase(user_listings.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.listings = action.payload.listings;
                console.log(action.payload.listings)
                state.error = null;
                state.message = action.payload.message
            })
            .addCase(user_listings.rejected, (state, action) => {
                state.status = "failed";
                console.log("i failed")
                state.error = action.payload.message;
            })
            
    }
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
