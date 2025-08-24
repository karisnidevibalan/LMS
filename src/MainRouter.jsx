// App.jsx or MainRouter.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App'; // The login/register form
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import ProtectedRoute from './ProtectedRoute';

function MainRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />

        {/* ✅ Protected routes */}
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute role="student">
              <StudentDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/teacher-dashboard"
          element={
            <ProtectedRoute role="teacher">
              <TeacherDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default MainRouter;
