import { createSlice } from "@reduxjs/toolkit";

export const counterSlice = createSlice({
    name: "counter",
    initialState:{
        count: 0,
    },
        reducers:{
            increment: (state)=>{state.count+=1},
            decrement: (state)=>{state.count-=1},
            addTen: (state)=>{state.count+=1000000},
        }
        
})

export const {increment, decrement, addTen} = counterSlice.actions

export default counterSlice.reducer