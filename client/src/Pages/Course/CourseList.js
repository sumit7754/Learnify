import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCourseData } from '../../Redux/Slices/courseSlice';
import HomeLayout from '../../Layout/HomeLayout';
import CourseCard from '../../components/CourseCard';

const CourseList = () => {
  const dispatch = useDispatch();
  const { courseData } = useSelector((state) => state.courseSlice);

  useEffect(() => {
    LoadCourses();
  }, []);

  async function LoadCourses() {
    await dispatch(getCourseData());
  }

  return (
    <HomeLayout>
      <div className="min-h-[90vh] pt-12 pl-20 flex flex-col gap-10 text-white">
        <h1 className="text-center text-3xl font-semibold mb-5">
          Explore the courses made by
          <span className="font-bold text-yellow-500">Industry experts</span>
        </h1>
        <div className="mb-10 flex flex-wrap gap-14">
          {courseData.map((data) => {
            return <CourseCard data={data} />;
          })}
        </div>
      </div>
    </HomeLayout>
  );
};

export default CourseList;
