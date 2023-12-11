import express from "express"
import isLoggedIn from "../middleware/auth.middleware.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

import {register,login,logout,getProfile,forgotPassword, resetPassword,changePassword,update} from "../controllers/user.controller.js"

router.post('/register',upload.single("avatar"),register);
router.post('/login',login);
router.post('/logout',logout);
router.get('/me',isLoggedIn,getProfile);
router.post('/forgot-password',forgotPassword);
router.post('/reset-password',resetPassword);
router.post('/change-password',isLoggedIn,changePassword)
router.put('/update',isLoggedIn,update);


export default router ;