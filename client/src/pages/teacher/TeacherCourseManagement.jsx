import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit3, Trash2, Users, BookOpen, Plus, RefreshCw, Upload } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const TeacherCourseManagement = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/course/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (courseId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/course/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCourses(courses.filter(course => course._id !== courseId));
      setShowDeleteConfirm(null);
      toast.success('Course deleted successfully!');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error(error.response?.data?.error || 'Failed to delete course');
    }
  };

  const handleUpdate = async (courseId, updatedData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/course/${courseId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setCourses(courses.map(course => 
        course._id === courseId ? response.data : course
      ));
      setEditingCourse(null);
      toast.success('Course updated successfully!');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error(error.response?.data?.error || 'Failed to update course');
    }
  };

  const EditCourseModal = ({ course, onClose, onSave }) => {
    const [formData, setFormData] = useState({
      title: course.title || '',
      description: course.description || '',
      category: course.category || '',
      level: course.level || 'Beginner',
      duration: course.duration || '',
      price: course.price || ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(course._id, formData);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
          <h3 className="text-2xl font-bold mb-4 text-slate-900">Edit Course</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Level
                </label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Duration (hours)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors font-semibold"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const DeleteConfirmModal = ({ course, onConfirm, onCancel }) => (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 w-full max-w-md shadow-xl">
        <h3 className="text-2xl font-bold mb-4 text-red-600">Delete Course</h3>
        <p className="text-slate-700 mb-6">
          Are you sure you want to delete "<span className="font-semibold">{course.title}</span>"? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => onConfirm(course._id)}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors font-semibold"
          >
            Delete
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-md transition-colors font-semibold"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fcd5ce] via-[#fae1dd] to-[#f9c5d1] py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              📚 My Courses
            </h1>
            <p className="text-gray-700">
              Manage your courses - Edit, Delete, and Track Performance
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={fetchCourses}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 border border-gray-600 font-semibold"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
            
            <Link
              to="/teacher/add-course"
              className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 font-semibold"
            >
              <Plus size={16} />
              Add Course
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Courses Grid */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 mb-4">
              No courses created yet
            </p>
            <Link
              to="/teacher/add-course"
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-md transition-colors font-semibold inline-block"
            >
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course._id}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow border border-slate-200"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    {course.title}
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-3">
                    {course.description || 'No description available'}
                  </p>
                </div>

                <div className="mb-4 space-y-2 text-sm text-slate-700 bg-slate-50 p-3 rounded">
                  <div className="flex justify-between">
                    <span className="font-semibold">Category:</span>
                    <span>{course.category || 'General'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Level:</span>
                    <span>{course.level || 'Beginner'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Duration:</span>
                    <span>{course.duration || 0} hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Price:</span>
                    <span>${course.price || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">Enrolled:</span>
                    <span className="font-bold text-teal-600">{course.enrolledStudents?.length || 0} students</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingCourse(course)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      <Edit3 size={16} />
                      Edit
                    </button>
                    
                    <button
                      onClick={() => setShowDeleteConfirm(course)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Link
                      to={`/teacher/course/${course._id}/materials`}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 font-semibold"
                    >
                      <Upload size={16} />
                      Materials
                    </Link>
                    
                    <Link
                      to={`/course/${course._id}/students`}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-2 rounded-md transition-colors flex items-center justify-center font-semibold"
                    >
                      <Users size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      {/* Edit Modal */}
      {editingCourse && (
        <EditCourseModal
          course={editingCourse}
          onClose={() => setEditingCourse(null)}
          onSave={handleUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          course={showDeleteConfirm}
          onConfirm={handleDelete}
          onCancel={() => setShowDeleteConfirm(null)}
        />
      )}
      </div>
    </div>
  );
};

export default TeacherCourseManagement;
