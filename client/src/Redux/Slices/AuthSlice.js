import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../Helper/axiosInstance';

export const createAccount = createAsyncThunk('/auth/signup', async (data) => {
  try {
    const respone = axiosInstance.post('/user/register', data);
    toast.promise(respone, {
      loading: 'wait! Creating Account',
      success: (data) => {
        return data?.data?.message;
      },
      error: 'Failed to create account',
    });
    return (await respone).data;
  } catch (error) {
    toast.error(error?.respone?.data?.message);
  }
});

const AuthSlcie = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: localStorage.getItem('isLoggedIn') || false,
    role: localStorage.getItem('role') || false,
    data: localStorage.getItem('data') || '',
  },
  reducers: {},
});

export default AuthSlcie.reducer;
