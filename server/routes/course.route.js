import {Router} from 'express';
import {getAllCourses , getLecturesByCourseId , createCourse , updateCourse , removeCourse} from '../controllers/course.contoller.js'
import isLoggedIn from '../middleware/auth.middleware.js';
import upload from '../middleware/multer.middleware.js';

const route = new Router();

route.route('/')
      .get(getAllCourses)
      .post(
         upload.single('thumbnail'),
         createCourse
       );

// data -> query param
route.route('/:id')
      .get(isLoggedIn,getLecturesByCourseId)
      .post(updateCourse)
      .delete(removeCourse);

export default route ;
