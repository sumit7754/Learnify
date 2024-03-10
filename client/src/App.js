import { Routes, Route, createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from './Pages/HomePage';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import CourseList from './Pages/Course/CourseList';
import CourseDescription from './Pages/Course/CourseDescription';
import Denied from './Pages/Denied';
import RequireAuth from './components/Auth/RequireAuth';
import CreateCourse from './Pages/Course/CreateCourse';
import Profile from './Pages/User/Profile';

function App() {
  const appRouter = createBrowserRouter([
    {
      path: '/',
      element: <HomePage />,
    },
    {
      path: '/signup',
      element: <Signup />,
    },
    {
      path: '/login',
      element: <Login />,
    },
    {
      path: '/courses',
      element: <CourseList />,
    },
    {
      path: '/courses/description',
      element: <CourseDescription />,
    },
    {
      path: '/denied',
      element: <Denied />,
    },
    {
      element: <RequireAuth allowedRoles={['ADMIN']} />,
      children: [
        {
          path: '/courses/create',
          element: <CreateCourse />,
        },
      ],
    },
    {
      element: <RequireAuth allowedRoles={['ADMIN', 'USER']} />,
      children: [
        {
          path: '/user/profile',
          element: <Profile />,
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={appRouter} />
    </div>
  );
}

export default App;
