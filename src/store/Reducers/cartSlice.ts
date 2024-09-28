// productId: product._id,
// quantity: 1,
// customer: userId,

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface cartState{
    carts:{
        productId:string,
        quantity:number,
        customer:string,
    }[]
}

const initialState: cartState={
    carts:[
        {
            productId:"df",
            quantity:1,
            customer:"df"
        }
    ]
}

const cartSlice = createSlice({
    name:"cart",
    initialState,
    reducers:{
        addToCart:(state,action: PayloadAction<{productId:string; quantity:number; customer:string}>)=>{
            const {productId, quantity, customer} =action.payload
            const existingItem = state.carts.find(item=>item.productId === productId)

            if (existingItem) {
                existingItem.quantity += quantity;
                if (existingItem.quantity <= 0) {
                  state.carts = state.carts.filter(item => item.productId !== productId);
                }
              } else if (quantity > 0) {
                state.carts.push({
                  productId,
                  quantity,
                  customer: action.payload.customer,
                });
              }
        }
    }
})

export const {addToCart} = cartSlice.actions

export default cartSlice.reducer