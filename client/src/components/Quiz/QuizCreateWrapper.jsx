import React from 'react';
import { useParams } from 'react-router-dom';
import QuizCreate from './QuizCreate';

export default function QuizCreateWrapper() {
  const { lectureId } = useParams();
  return <QuizCreate lectureId={lectureId} />;
}
