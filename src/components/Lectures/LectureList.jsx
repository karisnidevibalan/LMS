// components/Lectures/LectureList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function LectureList({ onSelect }) {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLectures = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/lectures', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setLectures(response.data);
      } catch (err) {
        setError('Failed to fetch lectures');
        console.error('Error fetching lectures:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchLectures();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600 dark:text-gray-400">Loading lectures...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-red-600 dark:text-red-400">{error}</div>
      </div>
    );
  }

  if (lectures.length === 0) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="text-gray-600 dark:text-gray-400">No lectures available</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Available Lectures
      </h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lectures.map(lecture => (
          <div
            key={lecture._id}
            onClick={() => onSelect(lecture._id)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6 border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {lecture.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3">
              {lecture.description}
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>
                {new Date(lecture.dateUploaded).toLocaleDateString()}
              </span>
              {lecture.visuals && lecture.visuals.length > 0 && (
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                  {lecture.visuals.length} visual{lecture.visuals.length !== 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LectureList;
