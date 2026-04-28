import { createSlice } from '@reduxjs/toolkit';

const tokenFromStorage = localStorage.getItem('jwt');
let userFromStorage = null;

try {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        userFromStorage = JSON.parse(userStr);
    }
} catch (e) {
    console.error(e);
}

const initialState = {
    user: userFromStorage,
    token: tokenFromStorage || null,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
          
            const { login, token } = action.payload;
            
            
            state.user = login;
            state.token = token;
            state.error = null;

            localStorage.setItem('jwt', token);
            localStorage.setItem('user', JSON.stringify(login));
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.error = null;
            
            localStorage.removeItem('jwt');
            localStorage.removeItem('user');
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
});

export const { setCredentials, logout, setError, clearError } = authSlice.actions;
export default authSlice.reducer;