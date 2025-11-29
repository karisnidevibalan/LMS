import React from 'react';
import { useParams } from 'react-router-dom';

const MaterialPreview = () => {
  const { materialId } = useParams();
  const token = localStorage.getItem('token');
  const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/study-materials/view/${materialId}?token=${token}`;

  // Determine previewable by file extension in URL (pdf, png, jpg, jpeg)
  const getExtension = (url) => {
    const match = url.match(/\.([a-zA-Z0-9]+)(?=\?|$)/);
    return match ? match[0].toLowerCase() : '';
  };
  const ext = getExtension(url);
  const previewableExts = ['.pdf', '.png', '.jpg', '.jpeg'];
  const isPreviewable = previewableExts.includes(ext);

  return (
    <div className="container mx-auto px-4 py-8 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Material Preview</h1>
      {isPreviewable ? (
        <iframe src={url} width="100%" height="600px" title="Material Preview" style={{background: '#f9f9f9', border: '1px solid #ccc', borderRadius: '8px'}} />
      ) : (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-semibold">Download/View Material</a>
      )}
      <div className="mt-4">
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline font-semibold">Open in New Tab</a>
      </div>
    </div>
  );
};

export default MaterialPreview;
