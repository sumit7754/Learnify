import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../Helper/axiosInstance.js';
import { response } from 'express';

export const getRazorpayId = createAsyncThunk('/razorpay/getId', async () => {
  try {
    const response = await axiosInstance.get('/payments/razorpay-key');
    return response.data;
  } catch (error) {
    toast.error('failed to laod data');
  }
});

export const purchaseCourseBundle = createAsyncThunk('/purchaseCourse', async () => {
  try {
    const response = await axiosInstance.post('/payments/subscribe');
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const verifyUserPayment = createAsyncThunk('/payment/verify', async (data) => {
  try {
    const response = await axiosInstance.post('/payments/verify', {
      razorpay_payment_id: data.razorpay_payment_id,
      razorpay_subscription_id: data.razorpay_subscription_id,
      razorpay_signature: data.razorpay_signature,
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

export const getPaymentRecord = createAsyncThunk('/payment/record', async () => {
  try {
    const response = axiosInstance.get('/payments?count=100');
    toast.promise(response, {
      loading: 'Getting the payment records',
      success: (data) => {
        return data?.data?.message;
      },
      error: 'Failed to get payment record ',
    });
    return response.data;
  } catch (error) {
    toast.error('Operation failed');
  }
});

export const cancelCourseBundle = createAsyncThunk('/payment/cancel', async () => {
  try {
    const response = await axiosInstance.post('/payments/unsubscribe');
    toast.promise(response, {
      loading: 'Unsubscribing the bundle',
      success: (data) => {
        return data?.data?.message;
      },
      error: 'Failed to unsubscribe ',
    });
    return response.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
});

const razorpaySlice = createSlice({
  name: 'razorpay',
  initialState: {
    key: '',
    subscription_id: '',
    isPaymentVerified: false,
    allPayments: {},
    finalMonths: {},
    monthlySalesRecord: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRazorPayId.fulfilled, (state, action) => {
        state.key = action?.payload?.key;
      })
      .addCase(purchaseCourseBundle.fulfilled, (state, action) => {
        state.subscription_id = action?.payload?.subscription_id;
      })
      .addCase(verifyUserPayment.fulfilled, (state, action) => {
        console.log(action);
        toast.success(action?.payload?.message);
        state.isPaymentVerified = action?.payload?.success;
      })
      .addCase(verifyUserPayment.rejected, (state, action) => {
        console.log(action);
        toast.success(action?.payload?.message);
        state.isPaymentVerified = action?.payload?.success;
      })
      .addCase(getPaymentRecord.fulfilled, (state, action) => {
        state.allPayments = action?.payload?.allPayments;
        state.finalMonths = action?.payload?.finalMonths;
        state.monthlySalesRecord = action?.payload?.monthlySalesRecord;
      });
  },
});

export default razorpaySlice.reducer;
