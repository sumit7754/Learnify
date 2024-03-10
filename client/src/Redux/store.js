import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './Slices/AuthSlice';
import courseSlice from './Slices/courseSlice';

const store = configureStore({
  reducer: {
    auth: AuthSlice,
    courseSlice: courseSlice,
  },
  devTools: true,
});

export default store;
