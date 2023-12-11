import AppError from "../utils/error.util.js";
import User from "../models/user.model.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto"

const cookieOptions = {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: true
};

const register = async (req, res, next) => {
    const { fullName, email, password , role } = req.body;

    if (!email || !fullName || !password) {
        return next(new AppError('All fields are required', 400));
    }

    const userExist = await User.findOne({ email });

    if (userExist) {
        return next(new AppError('Email already exists', 400));
    }

    // create an instance of the user model
    const user = await User.create({
        fullName,
        email,
        password,
        role,
        avatar: {
            public_id: email,
            secure_url: 'https://res.cloudinary.com/du9jzqlpt/image/upload/v1674647316/avatar_drzgxv.jpg',
        }
    });

    if (!user) {
        return next(new AppError('User registration failed, please try again', 400));
    }

    // TODO: File Upload

    if (req.file) {
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                width: 250,
                height: 250,
                gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill',
            });

            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
            }

            await fs.rm(req.file.path);

        } catch (error) {
            return next(
                new AppError(error.message || 'File not uploaded, please try again', 400)
            );
        }
    }

    await user.save();

    const token = await user.generateJWTToken();

    res.cookie('token', token, cookieOptions);

    user.password = undefined;

    res.status(201).json({
        status: true,
        message: 'User registered successfully',
        user
    });
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return next(new AppError('Email or password is required', 401));
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user || !user.comparePassword(password)) {
            return next(new AppError('Email or password does not match', 500));
        }

        const token = await user.generateJWTToken();
        res.cookie('token', token, cookieOptions);
        res.status(201).json({
            status: true,
            message: 'User Login successfully',
            user
        });
    } catch (e) {
        res.status(401).json({
            status: false,
            message: e.message
        });
    }
};

const logout = (req, res) => {
    res.cookie('token', null, {
        secure: true,
        maxAge: 0,
        httpOnly: true
    });

    res.json({
        status: true,
        message: 'Logged out successfully'
    });
};

const getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId);
        res.status(200).json({
            success: true,
            message: 'User details',
            user
        });
    } catch (e) {
        return next(new AppError('Failed to get user details', 500));
    }
};

const forgotPassword = async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new AppError('Email is required', 400));
    }

    const user = await User.findOne({ email });

    if (!user) {
        return next(new AppError('Email is not registered', 400));
    }

    // generate token 
    const resetToken = await user.generatePasswordResetToken();

    // save
    await user.save();

    // create url for forgot password 
    const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const subject = 'Reset Password';
    const message = `You can reset your password by clicking <a href=${resetPasswordUrl} target="_blank">Reset your password</a>\nIf the above link does not work for some reason then copy paste this link in a new tab ${resetPasswordUrl}.\n If you have not requested this, kindly ignore.`;

    try {
        await sendEmail(email, subject, message);

        res.status(200).json({
            success: true,
            message: `Reset password token has been sent to ${email} successfully`,
        });
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;

        await user.save();

        return next(
            new AppError(
                error.message || 'Something went wrong, please try again.',
                500
            )
        );
    }
};

const resetPassword = async (req, res, next) => {
    try {
      const { resetToken } = req.params;
      const { password } = req.body;
  
      if (!password) {
        return next(new AppError('Password is required', 400));
      }
  
      const forgotPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
  
      const user = await User.findOne({
        forgotPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() },
      });
  
      if (!user) {
        return next(new AppError('Token is invalid or expired, please try again', 400));
      }
  
      user.password = password;
      user.forgotPasswordExpiry = undefined;
      user.forgotPasswordToken = undefined;
  
      await user.save();
  
      res.status(200).json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      next(new AppError(error.message || 'Something went wrong, please try again.', 500));
    }
  };


const changePassword = async (req,res) => {
      const {oldPassword,newPassword} = req.body;
      const {id} = req.user;

      if(!oldPassword || !newPassword){
        return next(new AppError("All fields are madatory",400));
      }

      const user = await User.findById(id).select('+password');

      if(!user){
        return next(new AppError("User does not exist",400));
      }
      const isPsswordValid = await user.comparePassword(oldPassword);

      if(isPsswordValid){
         user.password=newPassword;
      }
      else{
        return next(new AppError("Invalid old Password",400));
      }

      await user.save();

      user.password=undefined ;

      res.status(200).json({
        status:true,
        message:"Password changed successfully"
      })
}

const update = async (req,res) => {
      const {fullName} = req.body;
      const {id} = req.user.id;
      const user = await User.findById(id);

      if(!user){
        return next(new AppError("user does not exist",400));
      }

      if(req.fullName){
        user.fullName = fullName;
      }

      if (req.file) {
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        try {
            const result = await cloudinary.v2.uploader.upload(req.file.path, {
                folder: 'lms', // Save files in a folder named lms
                width: 250,
                height: 250,
                gravity: 'faces', // This option tells cloudinary to center the image around detected faces (if any) after cropping or resizing the original image
                crop: 'fill',
            });

            if (result) {
                user.avatar.public_id = result.public_id;
                user.avatar.secure_url = result.secure_url;
            }

            await fs.rm(req.file.path);

        } catch (error) {
            return next(
                new AppError(error.message || 'File not uploaded, please try again', 400)
            );
        }
    }

    await user.save();

    res.status(200).json({
        status:true,
        message:"Update profile successfully"
    })
}

export {
    register,
    login,
    logout,
    getProfile,
    forgotPassword,
    resetPassword,
    changePassword,
    update
};
