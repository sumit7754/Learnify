import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import toast from 'react-hot-toast';
import axiosInstance from '../../Helper/axiosInstance';

export const getCourseData = createAsyncThunk('/course/get', async () => {
  try {
    const response = await axiosInstance.get('/courses');
    toast.promise(Promise.resolve(response.data.courses), {
      loading: 'Courses are loading...',
      success: 'Courses loaded successfully',
      error: 'Failed to get courses',
    });
    return response.data.courses;
  } catch (error) {
    toast.error('Failed to get courses');
    throw error;
  }
});

export const createCourse = createAsyncThunk('/courses/create', async (data) => {
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
  name: 'courseSlice',
  initialState: {
    courseData: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCourseData.fulfilled, (state, action) => {
      state.courseData = action.payload;
    });
  },
});

export default courseSlice.reducer;
