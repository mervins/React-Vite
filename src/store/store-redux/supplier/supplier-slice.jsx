import { createSlice } from "@reduxjs/toolkit";

const supplierSlice = createSlice({
    name:'supplier',
    initialState:{
        items:[],
    },
    reducers:{
        replaceItem(state, action){ 
            state.items = action.payload.items
        },
        addItem(state,action){

        },
        removeItem(state,action){

        }
    }
})

export const supplierActions = supplierSlice.actions;

export default supplierSlice.reducer;