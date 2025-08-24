
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const MaterialDetail = () => {
  const { materialId } = useParams();
  const [level, setLevel] = useState('short');
  const [aiContent, setAiContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLevelChange = (e) => {
    setLevel(e.target.value);
  };

  const fetchAIContent = async () => {
    setLoading(true);
    setError('');
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/study-materials/ai-content/${materialId}?level=${level}`;
      const token = localStorage.getItem('token');
      const res = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAiContent(res.data.content);
    } catch (err) {
      setError('Failed to fetch AI content.');
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Adaptive Study Mode</h2>
      <label className="block mb-2">Select your available study time:</label>
      <select value={level} onChange={handleLevelChange} className="mb-4 p-2 border rounded">
        <option value="short">Short (Keywords)</option>
        <option value="medium">Medium (Explanations)</option>
        <option value="long">Long (Rich Media Guide)</option>
      </select>
      <button onClick={fetchAIContent} className="bg-blue-600 text-white px-4 py-2 rounded">
        Start Studying
      </button>
      {loading && <p className="mt-4">Loading AI content...</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
      {aiContent && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="font-semibold mb-2">AI-Generated Content:</h3>
          <pre className="whitespace-pre-wrap text-sm">{aiContent}</pre>
        </div>
      )}
    </div>
  );
};

export default MaterialDetail;
