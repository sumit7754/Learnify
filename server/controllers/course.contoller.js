import Course from '../models/course.model.js';
import AppError from '../utils/error.util.js';
import cloudinary from 'cloudinary';
import fs from 'fs/promises';
import asyncHandler from 'express-async-handler'; // Import asyncHandler

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
    const { id } = req.params;
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

const createCourse = asyncHandler(async (req, res, next) => {
  const { title, description, category, createdBy } = req.body;
  if (!title || !description || !category || !createdBy) {
    return next(new AppError(`All fields are required ${req.body}`, 400));
  }

  try {
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
    });

    if (!course) {
      return next(new AppError('Course could not be created, please try again', 500));
    }

    if (req.file) {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
      });

      if (result) {
        course.thumbnail.public_id = result.public_id;
        course.thumbnail.secure_url = result.secure_url;
        await course.save();
      }

      await fs.rm(req.file.path); // Remove the temporary file after upload

      res.status(200).json({
        status: true,
        message: 'Course created successfully',
        course,
      });
    }
  } catch (error) {
    next(new AppError(error.message, 500));
  }
});

const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);

    if (!course) {
      return next(new AppError('Course with given Id does not exist', 500));
    }

    const updatedCourse = await Course.updateOne({ _id: id }, req.body, { runValidators: true });

    if (!updatedCourse) {
      return next(new AppError('Failed to update course', 500));
    }

    res.status(200).json({
      status: true,
      message: 'Course updated successfully',
      course: updatedCourse,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const removeCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const course = await Course.findById(id);
    if (!course) {
      return next(new AppError('Course with given id does not exist', 500));
    }
    await Course.findByIdAndDelete(id);

    res.status(200).json({
      status: true,
      message: 'Deleted successfully',
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }
};

const addLectureToCourseById = asyncHandler(async (req, res, next) => {
  const { title, description } = req.body;
  const { id } = req.params;

  let lectureData = {};

  if (!title || !description) {
    return next(new AppError('Title and Description are required', 400));
  }

  const course = await Course.findById(id);

  if (!course) {
    return next(new AppError('Invalid course id or course not found.', 400));
  }

  if (req.file) {
    try {
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: 'lms',
        chunk_size: 50000000,
        resource_type: 'video',
      });

      if (result) {
        lectureData.public_id = result.public_id;
        lectureData.secure_url = result.secure_url;
      }

      fs.rm(req.file.path);
    } catch (error) {
      for (const file of await fs.readdir('uploads/')) {
        await fs.unlink(path.join('uploads/', file));
      }

      return next(new AppError(JSON.stringify(error) || 'File not uploaded, please try again', 400));
    }
  }

  // Add the lectureData to the lectures array of the course
  course.lectures.push(lectureData);
  await course.save();

  res.status(200).json({
    status: true,
    message: 'Lecture added successfully',
    lectureData,
  });
});

export {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLectureToCourseById, // Fixed the function name in the export
};
