import User from "../models/user.model";
import AppError from "../utils/error.util";
import { razorpay } from '../server.js'

export const getRazorpayApiKey = async (req,res,next)=>{
       res.status(200).json({
          status:true,
          
       })
}

export const buysciption = async (req,res,next)=>{
     // logged in -> {user -> id }
      const { id } = req.user ;

      const user = await User.findById(id);

      if(!user){
        return next(new AppError('Unauthorized, please try again!'),500);
      }

      if(user.role==='ADMIN'){
        return next(new AppError('Admin not allowed to purchase'),500);
      }

      // key -> user (payment instance created)
      const subscription = await razorpay.subscriptions.create({
        plan_id: process.env.RAZORPAY_PLAN_ID, // The unique plan ID
        customer_notify: 1, // 1 means razorpay will handle notifying the customer, 0 means we will not notify the customer
        total_count: 12, // 12 means it will charge every month for a 1-year sub.
      });

      
      user.subscription.id=subscription.id;
      user.subscription.status=subscription.status;

    await user.save();
     
      res.status(200).json({
         status:true,
         message:'Subscribed Successfully'
      })
}

export const  verifySubscription = async (req,res,next)=>{

}

export const  cancelSubscriptio = async (req,res,next)=>{

}

export const  allPayment = async (req,res,next)=>{

}