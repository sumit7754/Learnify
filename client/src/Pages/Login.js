import { useState } from 'react';
import HomeLayout from '../Layout/HomeLayout';

import { loginAccount } from '../Redux/Slices/AuthSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...loginData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = loginData;

    if (!email || !password) {
      toast.error('Please fill in all the details');
      return;
    }

    try {
      const response = await dispatch(loginAccount(loginData));
      console.log(response);
      if (response.payload.status === true) {
        navigate('/');
        setLoginData({
          email: '',
          password: '',
        });
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <HomeLayout>
      <div className="flex item-center justify-center h-[90vh]">
        <form
          noValidate
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px-black]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center font-bold text-2xl">Login Form</h1>
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              required
              name="email"
              id="email"
              placeholder="Enter your email"
              onChange={handleUserInput}
              className="bg-transparent px-2 py-1 border"
              value={loginData.email}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your password"
              onChange={handleUserInput}
              className="bg-transparent px-2 py-1 border"
              value={loginData.password}
            />
          </div>
          <button
            type="submit"
            className="bg-yellow-500 transition-all ease-in-out p-2 rounded-lg text-lg cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </HomeLayout>
  );
};

export default Login;
