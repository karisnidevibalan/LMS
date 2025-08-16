import React from 'react';

const AlertMessage = ({ type = 'info', message }) => {
  const base = 'p-4 rounded-md mb-4 animate-fade text-sm';
  const typeStyles = {
    success: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
  };

  return <div className={`${base} ${typeStyles[type]}`}>{message}</div>;
};

export default AlertMessage;
