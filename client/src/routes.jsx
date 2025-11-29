import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

import Dashboard from './pages/Dashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import TeacherStudents from './pages/teacher/TeacherStudents';
import AddCourse from './components/teacher/AddCourse';

import Courses from './pages/Courses';
import RateCourse from './pages/RateCourse';

import StudentDashboard from './pages/student/StudentDashboard';
import EnrolledCourses from './pages/student/EnrolledCourses';
import StudentProgress from './pages/student/StudentProgress';
import MaterialPreview from './pages/student/MaterialPreview';
import CharacterSettings from './pages/CharacterSettings';

import LectureList from './components/Lectures/LectureList.jsx';
import LectureView from './components/Lectures/LectureView.jsx';

import QuizCreateWrapper from './components/Quiz/QuizCreateWrapper';
import QuizTakeWrapper from './components/Quiz/QuizTakeWrapper';

import TestStudyMaterials from './pages/TestStudyMaterials';

// Lazy-loaded components for better performance
import {
  LazyStudyMaterialsManager,
  LazyAdaptiveStudyInterface,
  LazyStudentMaterialsList,
  LazyTeacherCourseManagement,
  LazyCourseDetails,
  LazyWrapper
} from './utils/lazyComponents.jsx';import RoleProtectedRoute from './components/RoleProtectedRoute';

const RoutesComponent = () => (
  <Routes>
    {/* Public routes */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/test-materials" element={<TestStudyMaterials />} />

    {/* Dashboard route - auto-redirects to role-specific dashboard */}
    <Route path="/dashboard" element={<Dashboard />} />

    {/* Teacher routes */}
    <Route
      path="/teacher"
      element={
        <RoleProtectedRoute allowedRole="teacher">
          <TeacherDashboard />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/teacher/add"
      element={
        <RoleProtectedRoute allowedRole="teacher">
          <AddCourse />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/teacher/students"
      element={
        <RoleProtectedRoute allowedRole="teacher">
          <TeacherStudents />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/teacher/courses"
      element={
        <RoleProtectedRoute allowedRole="teacher">
          <LazyWrapper>
            <LazyTeacherCourseManagement />
          </LazyWrapper>
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/teacher/course/:courseId/materials"
      element={
        <RoleProtectedRoute allowedRole="teacher">
          <LazyWrapper>
            <LazyStudyMaterialsManager />
          </LazyWrapper>
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/teacher/course/:courseId/lectures"
      element={
        <RoleProtectedRoute allowedRole="teacher">
          <LectureList />
        </RoleProtectedRoute>
      }
    />

    {/* Courses */}
    <Route path="/courses" element={<Courses />} />
    <Route 
      path="/course/:courseId/materials/:materialId/study" 
      element={
        <LazyWrapper>
          <LazyAdaptiveStudyInterface />
        </LazyWrapper>
      } 
    />
    <Route 
      path="/course/:courseId/materials" 
      element={
        <LazyWrapper>
          <LazyStudentMaterialsList />
        </LazyWrapper>
      } 
    />
    <Route 
      path="/course/:id" 
      element={
        <LazyWrapper>
          <LazyCourseDetails />
        </LazyWrapper>
      } 
    />
    <Route path="/rate/:id" element={<RateCourse />} />

    {/* Student routes */}
    <Route
      path="/student"
      element={
        <RoleProtectedRoute allowedRole="student">
          <StudentDashboard />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/student/enrolled"
      element={
        <RoleProtectedRoute allowedRole="student">
          <EnrolledCourses />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/student/progress"
      element={
        <RoleProtectedRoute allowedRole="student">
          <StudentProgress />
        </RoleProtectedRoute>
      }
    />
    <Route
      path="/student/character-settings"
      element={
        <RoleProtectedRoute allowedRole="student">
          <CharacterSettings />
        </RoleProtectedRoute>
      }
    />
    <Route path="/student/materials/:materialId/preview" element={<MaterialPreview />} />

    {/* Lectures */}
    <Route path="/lectures" element={<LectureList />} />
    <Route path="/lectures/:lectureId" element={<LectureView />} />

    {/* Quiz Creation (Teacher only) */}
    <Route
      path="/lectures/:lectureId/quiz/create"
      element={
        <RoleProtectedRoute allowedRole="teacher">
          <QuizCreateWrapper />
        </RoleProtectedRoute>
      }
    />

    {/* Quiz Taking (Student only) */}
    <Route
      path="/lectures/:lectureId/quiz"
      element={
        <RoleProtectedRoute allowedRole="student">
          <QuizTakeWrapper />
        </RoleProtectedRoute>
      }
    />
  </Routes>
);

export default RoutesComponent;
