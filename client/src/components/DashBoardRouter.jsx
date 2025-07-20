import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import AddCourse from '../pages/teacher/AddCourse';
import MyCourses from '../pages/teacher/MyCourses';
import StudentDashboard from '../pages/student/StudentDashboard';
import AllCourses from '../pages/student/AllCourses';
import EnrolledCourses from '../pages/student/EnrolledCourses';

const DashboardRouter = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/" />;

  return user.role === 'teacher' ? (
    <Routes>
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/add-course" element={<AddCourse />} />
      <Route path="/my-courses" element={<MyCourses />} />
    </Routes>
  ) : (
    <Routes>
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/all-courses" element={<AllCourses />} />
      <Route path="/enrolled-courses" element={<EnrolledCourses />} />
    </Routes>
  );
};

export default DashboardRouter;
