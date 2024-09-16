import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice.js";
import listingReducer from "../features/listingSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        listing : listingReducer,
    }
});


export default store;