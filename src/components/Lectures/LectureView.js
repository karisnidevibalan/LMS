import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function LectureView({ user }) {
  const { lectureId } = useParams();
  const [lecture, setLecture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLecture = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/lectures/${lectureId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch lecture: ${response.statusText}`);
        }
        
        const data = await response.json();
        setLecture(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (lectureId) {
      fetchLecture();
    }
  }, [lectureId]);

  if (loading) return <div className="flex justify-center items-center py-16 text-gray-600 dark:text-gray-400">Loading lecture...</div>;
  if (error) return <div className="flex justify-center items-center py-16 text-red-600 dark:text-red-400">Error: {error}</div>;
  if (!lecture) return <div className="flex justify-center items-center py-16 text-gray-600 dark:text-gray-400">No lecture found.</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Lecture Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {lecture.title}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {lecture.description}
        </p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>By: {lecture.teacher?.name || 'Unknown Teacher'}</span>
          <span className="mx-2">•</span>
          <span>
            Uploaded: {new Date(lecture.dateUploaded).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Lecture Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
        <div className="whitespace-pre-wrap text-gray-800 dark:text-gray-200">
          {lecture.content}
        </div>
      </div>

      {/* Visuals */}
      {lecture.visuals && lecture.visuals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Visual Materials
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lecture.visuals.map((visual, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img
                  src={`http://localhost:5000/uploads/${visual}`}
                  alt={`Visual ${index + 1}`}
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          to="/lectures"
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          ← Back to Lectures
        </Link>
        
        {user?.role === 'student' && (
          <Link
            to={`/lectures/${lectureId}/comments`}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            View Comments
          </Link>
        )}
      </div>
    </div>
  );
}

export default LectureView;
