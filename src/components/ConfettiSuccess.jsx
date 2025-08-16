// components/ConfettiSuccess.jsx
import React from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const ConfettiSuccess = ({ run }) => {
  const { width, height } = useWindowSize();

  return run ? <Confetti width={width} height={height} recycle={false} numberOfPieces={300} /> : null;
};

export default ConfettiSuccess;