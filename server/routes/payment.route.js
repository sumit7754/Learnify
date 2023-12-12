import { Router } from "express";
import { authorizeRoles } from "../middleware/auth.middleware";
const router = Router();
import isLoggedIn, { authorizeRoles } from "../middleware/auth.middleware";
import {getRazorpayApiKey,buysciption,verifySubscription,cancelSubscription,allPayment} from '../controllers/payment.contoller.js'

router
    .route('/razorpay-key')
    .get(
        isLoggedIn,
        getRazorpayApiKey);

router
   .route('/subscribe')
   .post(
    isLoggedIn,
    buysciption)
   
router
    .route('/verify')
    .post(
        isLoggedIn,
        verifySubscription)
 
router
    .route('/unsubscribe')
    .post(
        isLoggedIn,
        cancelSubscription)
    
router
     .route('/')
     .get(
        isLoggedIn,
        authorizeRoles('ADMIN'),
        allPayment)    

export default router;     