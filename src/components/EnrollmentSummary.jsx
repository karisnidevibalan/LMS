import React from 'react';
import { Users, Check, X } from 'lucide-react';

const EnrollmentSummary = ({ course, userRole, isEnrolled, onEnrollmentToggle, loading }) => {
  if (userRole !== 'student') return null;

  return (
    <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
          <Users size={16} className="mr-1" />
          <span>{course.studentsEnrolled?.length || 0} students enrolled</span>
        </div>
        
        {isEnrolled && (
          <div className="flex items-center text-green-600 dark:text-green-400 text-sm font-medium">
            <Check size={16} className="mr-1" />
            <span>Enrolled</span>
          </div>
        )}
      </div>
      
      <button
        onClick={() => onEnrollmentToggle(course._id, isEnrolled)}
        disabled={loading}
        className={`w-full px-4 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
          isEnrolled
            ? 'bg-red-600 hover:bg-red-700 text-white'
            : 'bg-green-600 hover:bg-green-700 text-white'
        }`}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : isEnrolled ? (
          <div className="flex items-center justify-center">
            <X size={16} className="mr-1" />
            Unenroll
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <Check size={16} className="mr-1" />
            Enroll Now
          </div>
        )}
      </button>
    </div>
  );
};

export default EnrollmentSummary;
