import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import confetti from 'canvas-confetti'; // 🎉 import

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
    instituteName: '',
    educationLevel: '',
    careerDetails: '',
    idProof: null
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'idProof') {
      setForm({ ...form, idProof: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => {
        formData.append(key, form[key]);
      });

      await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // 🎉 Trigger confetti on success
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });

      setTimeout(() => {
        navigate('/login');
      }, 1500); // delay for confetti to be visible
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-100 to-yellow-100 p-8 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-xl bg-white p-6 rounded-xl shadow-lg space-y-4"
      >
        <h2 className="text-3xl font-bold text-center text-gray-800 animate-bounce">
          Register
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <input type="text" name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required />
        <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required />
        <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required />

        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition">
          <option value="student">Student</option>
          <option value="teacher">Teacher</option>
        </select>

        <input type="text" name="instituteName" placeholder="Institute Name" value={form.instituteName} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required />
        <input type="text" name="educationLevel" placeholder="Education Level" value={form.educationLevel} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required />
        <textarea name="careerDetails" placeholder="Career Details" value={form.careerDetails} onChange={handleChange} className="w-full p-2 border rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" rows="3" required />

        <div>
          <label className="block mb-1 text-black font-medium">Upload ID Proof (PDF/JPG/PNG):</label>
          <input type="file" name="idProof" accept=".pdf,.jpg,.jpeg,.png" onChange={handleChange} className="w-full p-2 border rounded bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition" required />
          {form.idProof && (
            <p className="text-sm text-green-700 mt-1">
              Selected file: {form.idProof.name}
            </p>
          )}
        </div>

        <button type="submit" className="w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white py-2 rounded shadow-lg hover:scale-105 transition-transform duration-300">
          Register
        </button>

        <p className="text-center mt-4 text-black">
          Already have an account?{' '}
          <a href="/login" className="text-blue-600 underline">
            Login
          </a>
        </p>
      </form>
    </div>
  );
};

export default Register;
