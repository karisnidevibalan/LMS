import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import StudentDashboard from '../pages/student/StudentDashboard';

const Dashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [navigate, user]);

  if (!user) return null;

  if (user.role === 'teacher') {
    return <TeacherDashboard />;
  } else if (user.role === 'student') {
    return <StudentDashboard />;
  } else {
    return (
      <div className="text-center p-8 text-red-600">
        ❌ Invalid role. Please contact admin.
      </div>
    );
  }
};

export default Dashboard;
