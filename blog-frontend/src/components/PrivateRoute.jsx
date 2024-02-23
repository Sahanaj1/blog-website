import React from 'react';
import { Route,Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { user } = useAuth(); 

  return user ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;