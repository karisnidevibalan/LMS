import React from 'react';
import { useParams } from 'react-router-dom';

const MaterialPreview = () => {
  const { materialId } = useParams();
  const token = localStorage.getItem('token');
  const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/study-materials/view/${materialId}?token=${token}`;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Material Inline Preview</h1>
      <iframe
        src={url}
        width="100%"
        height="600px"
        title="Material Preview"
        style={{ border: '1px solid #ccc', borderRadius: '8px' }}
      />
      <div className="mt-4">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Open in New Tab</a>
      </div>
    </div>
  );
};

export default MaterialPreview;
