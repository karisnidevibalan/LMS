import React, { Suspense, lazy } from 'react';
import LoadingSpinner from '../components/LoadingSpinner';

// Create lazy-loaded components for better code splitting
export const LazyStudyMaterialsManager = lazy(() => 
  import('../pages/teacher/StudyMaterialsManager').then(module => ({ default: module.default }))
);

export const LazyAdaptiveStudyInterface = lazy(() => 
  import('../pages/AdaptiveStudyInterface').then(module => ({ default: module.default }))
);

export const LazyStudentMaterialsList = lazy(() => 
  import('../pages/student/StudentMaterialsList').then(module => ({ default: module.default }))
);

export const LazyTeacherCourseManagement = lazy(() => 
  import('../pages/teacher/TeacherCourseManagement').then(module => ({ default: module.default }))
);

export const LazyCourseDetails = lazy(() => 
  import('../pages/CourseDetails').then(module => ({ default: module.default }))
);

// Wrapper component with loading fallback
export const LazyWrapper = ({ children, fallback = <LoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

export default {
  LazyStudyMaterialsManager,
  LazyAdaptiveStudyInterface,
  LazyStudentMaterialsList,
  LazyTeacherCourseManagement,
  LazyCourseDetails,
  LazyWrapper
};
