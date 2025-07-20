import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
  const [formType, setFormType] = useState('login');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });

  const navigate = useNavigate();

  const toggleForm = () => {
    setFormType(formType === 'login' ? 'register' : 'login');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint = formType === 'login' ? 'login' : 'register';

    try {
      const res = await fetch(`http://localhost:5000/api/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });

      const text = await res.text();
      let data = {};

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Server returned invalid JSON');
      }

      if (!res.ok) {
        throw new Error(data.message || 'Request failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(`Welcome ${data.user?.name || 'User'}!`);
        
        // Navigate based on role
        if (data.user.role === 'teacher') {
          navigate('/teacher/dashboard');
        } else if (data.user.role === 'student') {
          navigate('/student/dashboard');
        } else {
          navigate('/dashboard');
        }
      } else {
        alert(data.message || 'Registration successful. Please login.');
        setFormType('login');
      }
    } catch (err) {
      alert(err.message || 'Something went wrong.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <form className="form-container" onSubmit={handleSubmit}>
        <h2 className="form-heading">{formType === 'login' ? 'Login' : 'Register'}</h2>

        {formType === 'register' && (
          <>
            <label htmlFor="name" className="auth-label">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              placeholder="Your Name"
              value={user.name}
              onChange={handleChange}
              required
              className="input-field"
            />

            <label htmlFor="role" className="auth-label">Role</label>
            <select
              name="role"
              id="role"
              value={user.role}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="student">Student</option>
              <option value="teacher">Faculty</option>
            </select>
          </>
        )}

        <label htmlFor="email" className="auth-label">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
          required
          className="input-field"
        />

        <label htmlFor="password" className="auth-label">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
          required
          className="input-field"
        />

        <button type="submit" className="auth-button">
          {formType === 'login' ? 'Login' : 'Register'}
        </button>

        <p
          className="mt-4 text-center text-sm text-indigo-900 hover:underline cursor-pointer"
          onClick={toggleForm}
        >
          {formType === 'login'
            ? "Don't have an account? Register"
            : 'Already registered? Login'}
        </p>
      </form>
    </div>
  );
};

export default AuthForm;
