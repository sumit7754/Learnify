import { Router } from 'express';
import {
  getAllCourses,
  getLecturesByCourseId,
  createCourse,
  updateCourse,
  removeCourse,
  addLectureToCourseById,
} from '../controllers/course.contoller.js';

import { isLoggedIn, authorizeRoles, authorizeSubscribers } from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const route = new Router();

route.route('/').get(getAllCourses);
route.route('/').post(isLoggedIn, authorizeRoles('ADMIN'), upload.single('thumbnail'), createCourse);

// data -> query param
route
  .route('/:id')
  .get(isLoggedIn, authorizeRoles('ADMIN'), getLecturesByCourseId)

  .put(isLoggedIn, authorizeRoles('ADMIN'), updateCourse)

  .delete(isLoggedIn, authorizeRoles('ADMIN'), removeCourse)
  .post(isLoggedIn, authorizeRoles('ADMIN'), addLectureToCourseById);

export default route;
