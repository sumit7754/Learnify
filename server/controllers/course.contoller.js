import Course from '../models/course.model.js';
import AppError from '../utils/error.util.js';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';

const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({}).select('-lectures');

    res.status(200).json({
      status: true,
      message: 'All Courses',
      courses,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const getLecturesByCourseId = async (req, res, next) => {
  try {
    const { id } = req.params; // Use req.params instead of req.param
    const course = await Course.findById(id);
    res.status(200).json({
      status: true,
      message: 'Course lectures fetched successfully',
      lectures: course.lectures,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const createCourse = async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;
  if (!title || !description || !category || !createdBy) {
    return next(new AppError('All fields are required', 400));
  }

  try {
    // if exist and then create instance
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
    });

    if (!course) {
      return next(new AppError('course could not be created, please try again', 500));
    }

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
      });

      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
      }

      await fs.rm(req.file.path);

      await course.save();

      res.status(200).json({
        status: true,
        message: 'course created successfully',
        course,
      });
    }
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const updateCourse = async (req, res, next) => {
  // Implement your update logic here
};

const removeCourse = async (req, res, next) => {
  // Implement your remove logic here
};

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
};
