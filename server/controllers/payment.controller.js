import crypto from 'crypto';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import User from '../models/user.model.js';
import AppError from '../utils/appError.js';
import { razorpay } from '../server.js';
import Payment from '../models/Payment.model.js';

export const buySubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);

  if (!user) return next(new AppError('Unauthorized, please login'));
  if (user.role === 'ADMIN') return next(new AppError('Admin cannot purchase a subscription', 400));

  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID,
    customer_notify: 1,
    total_count: 12,
  });

  user.subscription = { id: subscription.id, status: subscription.status };
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Subscribed successfully',
    subscription_id: subscription.id,
  });
});

export const verifySubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body;

  const user = await User.findById(id);
  const subscriptionId = user.subscription.id;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_SECRET)
    .update(`${razorpay_payment_id}|${subscriptionId}`)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return next(new AppError('Payment not verified, please try again.', 400));
  }

  await Payment.create({ razorpay_payment_id, razorpay_subscription_id, razorpay_signature });

  user.subscription.status = 'active';
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Payment verified successfully',
  });
});

export const cancelSubscription = asyncHandler(async (req, res, next) => {
  const { id } = req.user;
  const user = await User.findById(id);

  if (user.role === 'ADMIN') {
    return next(new AppError('Admin does not need to cancel subscription', 400));
  }

  const subscriptionId = user.subscription.id;

  try {
    const subscription = await razorpay.subscriptions.cancel(subscriptionId);
    user.subscription.status = subscription.status;
    await user.save();
  } catch (error) {
    return next(new AppError(error.error.description, error.statusCode));
  }

  const payment = await Payment.findOne({ razorpay_subscription_id: subscriptionId });
  const timeSinceSubscribed = Date.now() - payment.createdAt;
  const refundPeriod = 14 * 24 * 60 * 60 * 1000;

  if (timeSinceSubscribed > refundPeriod) {
    return next(new AppError('Refund period is over. No refunds provided.', 400));
  }

  await razorpay.payments.refund(payment.razorpay_payment_id, { speed: 'optimum' });

  user.subscription = { id: undefined, status: undefined };
  await user.save();
  await payment.remove();

  res.status(200).json({
    success: true,
    message: 'Subscription canceled successfully',
  });
});

export const getRazorpayApiKey = asyncHandler(async (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Razorpay API key',
    key: process.env.RAZORPAY_KEY_ID,
  });
});

export const allPayments = asyncHandler(async (req, res) => {
  const { count = 10, skip = 0 } = req.query;

  const allPayments = await razorpay.subscriptions.all({
    count: parseInt(count, 10),
    skip: parseInt(skip, 10),
  });

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthlyPayments = allPayments.items.reduce((acc, payment) => {
    const month = new Date(payment.start_at * 1000).getMonth();
    acc[monthNames[month]] = (acc[monthNames[month]] || 0) + 1;
    return acc;
  }, {});

  res.status(200).json({
    success: true,
    message: 'All payments',
    allPayments,
    monthlyPayments,
  });
});
