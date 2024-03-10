import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';

const RequireAuth = ({ allowedRoles }) => {
  const navigate = useNavigate();
  const { isLoggedIn, role } = useSelector((store) => store.auth);

  return isLoggedIn && allowedRoles.find((myrole) => myrole === role) ? (
    <Outlet />
  ) : isLoggedIn ? (
    <Navigate to="/denied" />
  ) : (
    <Navigate to="/login" />
  );
};

export default RequireAuth;
