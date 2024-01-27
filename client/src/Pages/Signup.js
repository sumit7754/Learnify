// Import necessary modules and components
import React, { useState } from 'react';
import HomeLayout from '../Layout/HomeLayout';
import { BsPersonCircle } from 'react-icons/bs';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createAccount } from '../Redux/Slices/AuthSlice'; // Import the correct action creator

// Define the Signup component
const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Define state variables
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
    avatar: '',
  });
  const [previewImage, setPreviewImage] = useState('');

  // Handle user input changes
  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setSignupData({
      ...signupData,
      [name]: value,
    });
  };

  // Handle image upload
  const getImage = (event) => {
    const uploadedImage = event.target.files[0];
    if (uploadedImage) {
      setSignupData({
        ...signupData,
        avatar: uploadedImage,
      });
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedImage);
      fileReader.onloadend = () => {
        setPreviewImage(fileReader.result);
      };
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validation checks
    const { fullName, email, password } = signupData;
    if (!fullName || !email || !password) {
      toast.error('Please fill all the details');
      return;
    }

    // Dispatch action to create account
    try {
      const response = await dispatch(createAccount(signupData));
      console.log(response);
      // Handle success response
      if (response.payload.status) navigate('/');

      setSignupData({
        fullName: '',
        email: '',
        password: '',
        avatar: '',
      });
      setPreviewImage('');
    } catch (error) {
      // Handle error response
      console.error('Error creating account:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  // Render the component
  return (
    <HomeLayout>
      <div className="flex items-center justify-center h-[90vh]">
        <form
          noValidate
          className="flex flex-col justify-center gap-3 rounded-lg p-4 text-white w-96 shadow-[0_0_10px-black]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-center font-bold text-2xl">Registration Page</h1>
          {/* Image Upload */}
          <label htmlFor="image_uploads" className="cursor-pointer">
            {previewImage ? (
              <img className="w-24 h-24 rounded-full m-auto" src={previewImage} alt="Preview" />
            ) : (
              <BsPersonCircle className="w-24 h-24 rounded-full m-auto" />
            )}
          </label>
          <input
            type="file"
            id="image_uploads"
            name="image_uploads"
            accept=".jpg,.jpeg,.png,.svg"
            className="hidden"
            onChange={getImage}
          />
          {/* Full Name Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="font-semibold">
              Name
            </label>
            <input
              type="text"
              required
              name="fullName"
              id="fullName"
              placeholder="Enter your FullName"
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.fullName}
            />
          </div>
          {/* Email Input */}
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
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.email}
            />
          </div>
          {/* Password Input */}
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              required
              name="password"
              id="password"
              placeholder="Enter your password..."
              className="bg-transparent px-2 py-1 border"
              onChange={handleUserInput}
              value={signupData.password}
            />
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="bg-yellow-500 transition-all ease-in-out p-2 rounded-lg text-lg cursor-pointer"
          >
            Create Account
          </button>
          {/* Login Link */}
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </HomeLayout>
  );
};

// Export the component
export default Signup;
