import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/auth-slice";
import supplierSlice from "./supplier/supplier-slice";

const store = configureStore({
    reducer:{
        auth:authSlice,
        supplier:supplierSlice
    }
});

export default store;