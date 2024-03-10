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

export const loginAccount = createAsyncThunk('/auth/login', async (data) => {
  try {
    const respone = axiosInstance.post('/user/login', data);
    toast.promise(respone, {
      loading: 'wait! ',
      success: (data) => {
        return data?.data?.message;
      },
      error: 'Failed to Login',
    });
    return (await respone).data;
  } catch (error) {
    toast.error(error?.respone?.data?.message);
  }
});

export const logout = createAsyncThunk('/auth/logout', async () => {
  try {
    const response = axiosInstance.post('user/logout');
    toast.promise(response, {
      loading: 'Wait! logging out your account',
      success: (data) => {
        return data?.data?.message;
      },
      error: 'Failed to logout your account',
    });
    return await response;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
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
  extraReducers: (builder) => {
    builder
      .addCase(loginAccount.fulfilled, (state, action) => {
        localStorage.setItem('data', JSON.stringify(action?.payload?.user));
        localStorage.setItem('isLoggedIn', true);
        localStorage.setItem('role', action?.payload?.user?.role);
        state.isLoggedIn = true;
        state.data = action?.payload?.user;
        state.role = action?.payload?.user?.role;
      })
      .addCase(logout.fulfilled, (state) => {
        localStorage.clear();
        state.isLoggedIn = false;
        state.role = '';
        state.data = {};
      });
  },
});

export default AuthSlcie.reducer;
