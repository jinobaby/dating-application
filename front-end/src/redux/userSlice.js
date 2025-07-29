import { createSlice } from '@reduxjs/toolkit';
import UserLogin from '../UserPages/UserLogin';

const LoginSlice = createSlice({
    name: 'UserLogin',
    initialState: {
        UserLoginStore:[]
    },  
    reducers: {
        userLoginData: (state, action) => {
            state.UserLoginStore = action.payload;
        },
        clearUserLogin: (state) => {
            state.UserLoginStore = [];
        }
    }
})

export const { userLoginData, clearUserLogin } = LoginSlice.actions;
export default LoginSlice.reducer;