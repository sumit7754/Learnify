import crypto from 'crypto';
import fs from 'fs/promises';
import cloudinary from 'cloudinary';
import asyncHandler from '../middlewares/asyncHandler.middleware.js';
import AppError from '../utils/appError.js';
import User from '../models/user.model.js';
import sendEmail from '../utils/sendEmail.js';

const cookieOptions = {
  secure: process.env.NODE_ENV === 'production',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
};

export const registerUser = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, role = 'USER', avatar } = req.body;

  if (!fullName || !email || !password) {
    return next(new AppError('All fields are required', 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new AppError('Email already exists', 409));
  }

  const user = await User.create({
    fullName,
    email,
    password,
    avatar: {
      public_id: email,
      secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
    },
    role,
  });

  if (!user) {
    return next(new AppError('User registration failed', 400));
  }

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
        width: 250,
        height: 250,
        gravity: 'faces',
        crop: 'fill',
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;
        await fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError('File upload failed', 400));
    }
  }

  await user.save();

  const token = await user.generateJWTToken();
  user.password = undefined;
  res.cookie('token', token, cookieOptions);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user,
  });
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Email and Password are required', 400));
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Invalid credentials', 401));
  }

  const token = await user.generateJWTToken();
  user.password = undefined;
  res.cookie('token', token, cookieOptions);

  res.status(200).json({
    success: true,
    message: 'User logged in successfully',
    user,
  });
});

export const logoutUser = asyncHandler(async (_req, res) => {
  res.cookie('token', null, { secure: process.env.NODE_ENV === 'production', maxAge: 0, httpOnly: true });
  res.status(200).json({
    success: true,
    message: 'User logged out successfully',
  });
});

export const getLoggedInUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    message: 'User details fetched successfully',
    user,
  });
});

export const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email is required', 400));
  }

  const user = await User.findOne({ email });
  if (!user) {
    return next(new AppError('Email not registered', 400));
  }

  const resetToken = await user.generatePasswordResetToken();
  await user.save();

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const subject = 'Reset Password';
  const message = `Click <a href="${resetPasswordUrl}" target="_blank">here</a> to reset your password. If the link does not work, copy and paste this URL: ${resetPasswordUrl}`;

  try {
    await sendEmail(email, subject, message);
    res.status(200).json({
      success: true,
      message: `Reset password token sent to ${email}`,
    });
  } catch (error) {
    user.forgotPasswordToken = undefined;
    user.forgotPasswordExpiry = undefined;
    await user.save();
    return next(new AppError('Failed to send email', 500));
  }
});

export const resetPassword = asyncHandler(async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  if (!password) {
    return next(new AppError('Password is required', 400));
  }

  const forgotPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  const user = await User.findOne({
    forgotPasswordToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Invalid or expired token', 400));
  }

  user.password = password;
  user.forgotPasswordToken = undefined;
  user.forgotPasswordExpiry = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password reset successfully',
  });
});

export const changePassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id).select('+password');

  if (!oldPassword || !newPassword) {
    return next(new AppError('Old and new passwords are required', 400));
  }

  if (!user || !(await user.comparePassword(oldPassword))) {
    return next(new AppError('Invalid old password', 400));
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: 'Password changed successfully',
  });
});

export const updateUser = (req, res) => {};
