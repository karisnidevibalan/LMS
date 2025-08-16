import React from 'react';
import { useParams } from 'react-router-dom';
import QuizTake from './QuizTake';

export default function QuizTakeWrapper() {
  const { lectureId } = useParams();
  return <QuizTake lectureId={lectureId} />;
}
