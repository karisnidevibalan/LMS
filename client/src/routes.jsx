// src/routes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Courses from './pages/Courses';
import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import AddCourse from './pages/teacher/AddCourse';
import CourseDetails from './pages/CourseDetails';
import RateCourse from './pages/RateCourse';
import MyCourses from './pages/student/MyCourses';
import RoleProtectedRoute from './components/RoleProtectedRoute';

const RoutesComponent = () => (
  <Routes>
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/teacher" element={<TeacherDashboard />} />
    <Route path="/teacher/add" element={<AddCourse />} />
    
<Route
  path="/teacher"
  element={
    <RoleProtectedRoute allowedRole="teacher">
      <TeacherDashboard />
    </RoleProtectedRoute>
  }
/>

<Route
  path="/student/mycourses"
  element={
    <RoleProtectedRoute allowedRole="student">
      <MyCourses />
    </RoleProtectedRoute>
  }
/>
    <Route path="/course/:id" element={<CourseDetails />} />
    <Route path="/rate/:id" element={<RateCourse />} />
    <Route path="/student/mycourses" element={<MyCourses />} />
  </Routes>
);

export default RoutesComponent;
