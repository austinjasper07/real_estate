import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import listingReducer from "../features/listingSlice.js";
import userReducer from "../features/userSlice.js"

const store = configureStore({
    reducer: {
        auth: authReducer,
        listing: listingReducer,
        user: userReducer,
    }
});


export default store;