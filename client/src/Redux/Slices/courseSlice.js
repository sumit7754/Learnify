import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-hot-toast';

import axiosInstance from '../../Helpers/axiosInstance';

const initialState = {
  courseData: [],
};

export const getAllCourses = createAsyncThunk('/course/get', async () => {
  try {
    const response = await axiosInstance.get('/courses');
    toast.success('Courses loaded successfully');
    return response.data.courses;
  } catch (error) {
    toast.error('Failed to get the courses');
    throw error;
  }
});

export const deleteCourse = createAsyncThunk('/course/delete', async (id) => {
  try {
    const response = await axiosInstance.delete(`/courses/${id}`);
    toast.success('Course deleted successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to delete the course');
    throw error;
  }
});

export const createNewCourse = createAsyncThunk('/course/create', async (data) => {
  try {
    let formData = new FormData();
    formData.append('title', data?.title);
    formData.append('description', data?.description);
    formData.append('category', data?.category);
    formData.append('createdBy', data?.createdBy);
    formData.append('thumbnail', data?.thumbnail);

    console.log(formData);
    const response = await axiosInstance.post('/courses', formData);
    toast.success('Course created successfully');
    return response.data;
  } catch (error) {
    toast.error('Failed to create the course');
    throw error;
  }
});

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllCourses.fulfilled, (state, action) => {
      state.courseData = action.payload;
    });
  },
});

export default courseSlice.reducer;
