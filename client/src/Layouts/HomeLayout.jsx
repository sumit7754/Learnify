import React, { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { AiFillCloseCircle } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Components/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../Redux/Slices/AuthSlice';

function HomeLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((store) => store?.auth?.isLoggedIn);
  const role = useSelector((store) => store?.auth?.role);

  const [isDarkMode, setIsDarkMode] = useState(window.matchMedia('(prefers-color-scheme: dark)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', () => {
      setIsDarkMode(mediaQuery.matches);
    });
  }, []);

  function changeWidth() {
    const drawerSide = document.getElementsByClassName('drawer-side');
    drawerSide[0].style.width = 'auto';
  }

  function hideDrawer() {
    const element = document.getElementsByClassName('drawer-toggle');
    element[0].checked = false;

    const drawerSide = document.getElementsByClassName('drawer-side');
    drawerSide[0].style.width = '0';
  }

  const handleLogout = async (e) => {
    e.preventDefault();
    const res = await dispatch(logout());
    if (res.payload && res.payload.status) {
      navigate('/');
    } else {
      console.error('Logout failed or status is false');
    }
  };

  console.log(isDarkMode);

  return (
    <div data-theme="dark" className={`min-h-[90vh] `}>
      <div className="drawer absolute left-0 z-50 w-fit">
        <input className="drawer-toggle" id="my-drawer" type="checkbox" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="cursor-pointer relative">
            <FiMenu size={'32px'} className="font-bold text-white m-4" />
          </label>
        </div>
        <div className="drawer-side w-auto">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-48 h-[100%] sm:w-80 bg-base-200 text-base-content relative">
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer}>
                <AiFillCloseCircle size={24} />
              </button>
            </li>
            <li>
              <Link to="/">Home</Link>
            </li>
            {isLoggedIn && role === 'ADMIN' && (
              <li>
                <Link to="/admin/dashboard">Admin Dashboard</Link>
              </li>
            )}
            {isLoggedIn && role === 'ADMIN' && (
              <li>
                <Link to="/course/create">Create Course</Link>
              </li>
            )}
            <li>
              <Link to="/courses">All Courses</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/about">About Us</Link>
            </li>

            {!isLoggedIn && (
              <div className="w-full flex items-center justify-center">
                <button className="btn-primary bg-pink-800 px-4 py-1 font-semibold rounded-md">
                  <Link to="/login">Login</Link>
                </button>
                <button className="btn-secondary bg-purple-800 px-4 py-1 font-semibold rounded-md">
                  <Link to="/signup">Signup</Link>
                </button>
                <button className="btn-secondary bg-purple-800 px-4 py-1 font-semibold rounded-md">
                  <Link to="/testLogin">Test Login</Link>
                </button>
              </div>
            )}

            {isLoggedIn && (
              <div className="w-full flex items-center justify-center">
                <button className="btn-primary bg-pink-800 px-4 py-1 font-semibold rounded-md">
                  <Link to="/user/profile">Profile</Link>
                </button>

                <button className="btn-secondary bg-purple-800 px-4 py-1 font-semibold rounded-md">
                  <Link onClick={handleLogout}>Logout</Link>
                </button>
              </div>
            )}
          </ul>
        </div>
      </div>

      {children}

      <Footer />
    </div>
  );
}

export default HomeLayout;
