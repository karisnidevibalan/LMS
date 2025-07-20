// src/components/RoleProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleProtectedRoute = ({ allowedRole, children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  if (!token || !user) return <Navigate to="/login" replace />;

  if (user.role !== allowedRole) {
    // 🔐 Redirect to login or a 'Not Allowed' page
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleProtectedRoute;
