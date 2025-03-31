
import { configureStore } from '@reduxjs/toolkit';
import alertReducer from './features/alertSlice';
import { userSlice } from './features/userSlice';

const store = configureStore({
    reducer: {
        alert: alertReducer,
        user: userSlice.reducer,
    },
});

export default store;
