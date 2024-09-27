import { createSlice, PayloadAction } from "@reduxjs/toolkit"

// type initialState = {
//     value: AuthState
// }

interface AuthState {
    status: boolean
    userData: {email:string|null; password:string|null} |null
}

const initialState: AuthState ={
        status:false,
        userData: null
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        login: (state, action: PayloadAction<{email: string;password:string}>)=>{
            state.status = true;
            state.userData=action.payload
        },
        logout:(state)=>{
            state.status=false;
            state.userData= null
        }
    }
})

export const {login, logout}= authSlice.actions;

export default authSlice.reducer;