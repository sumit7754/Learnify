import React from 'react';
import HomeLayout from '../Layout/HomeLayout';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <HomeLayout>
      <div className="pt-10 text-white flex items-center justify-center gap-10 mx-16 h-[90vh]">
        <div className="w-1/2 space-y-6">
          <h1 className="text-5xl font-semibold">
            Find out Best
            <span className="text-yellow-500 font-bold"> Online Courses</span>
          </h1>
          <p className="text-xl text-gray-200">
            We have a large library of courses taught by highly skilled and qualified faculties at a very affordable
            cost.
          </p>
          <div className="space-x-6">
            <Link to="/courses">
              <button className="bg-yellow-500  rounded-lg hover:bg-yellow-600 trasition ease-in-out duration-300 px-3 py-4">
                Explore Courses
              </button>
            </Link>
          </div>
        </div>
      </div>
    </HomeLayout>
  );
}

export default HomePage;
