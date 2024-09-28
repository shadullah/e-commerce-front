import {configureStore} from "@reduxjs/toolkit"
import authSlice from "./Reducers/authSlice";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import cartSlice from "./Reducers/cartSlice";

export const store = configureStore({
    reducer:{
        auth: authSlice,
        cart: cartSlice
    }
})

export type RootState= ReturnType<typeof store.getState>
export type AppDispatch= typeof store.dispatch

export const useAppSelector: TypedUseSelectorHook<RootState>= useSelector