import { Router } from 'express';
const router = Router();
import isLoggedIn, { authorizeRoles } from '../middleware/auth.middleware.js';
import {
  getRazorpayApiKey,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  allPayment,
} from '../controllers/payment.contoller.js';

router.route('/razorpay-key').get(isLoggedIn, getRazorpayApiKey);

router.route('/subscribe').post(isLoggedIn, buySubscription);

router.route('/verify').post(isLoggedIn, verifySubscription);

router.route('/unsubscribe').post(isLoggedIn, cancelSubscription);

router.route('/').get(isLoggedIn, authorizeRoles('ADMIN'), allPayment);

export default router;
