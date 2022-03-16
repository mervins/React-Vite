import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
    name:'auth',
    initialState:{
        url_base:'http://127.0.0.1:3329',
        isLoggedIn:false,
        token:null,
        users:{}
    },
    reducers:{
        onLogin(state,action){},
        onLogout(state,action){}
    }
});

export const authActions = authSlice.actions;
export default authSlice.reducer;