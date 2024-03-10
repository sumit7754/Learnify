import { createSlice } from '@reduxjs/toolkit';
const razorpaySlice = createSlice({
  name: 'razorpay',
  initialState: {
    key: '',
    subscription_id: '',
    isPaymentVerified: false,
    allPayment: {},
    finalMonth: {},
    monthlySalesRecord: {},
  },
});
