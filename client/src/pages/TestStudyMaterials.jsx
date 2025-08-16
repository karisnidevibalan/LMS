import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const TestStudyMaterials = () => {
  const [testResults, setTestResults] = useState([]);

  const runTest = async (testName, testFn) => {
    try {
      const result = await testFn();
      setTestResults(prev => [...prev, { name: testName, status: 'PASS', result }]);
    } catch (error) {
      setTestResults(prev => [...prev, { name: testName, status: 'FAIL', error: error.message }]);
    }
  };

  const testRoutes = async () => {
    // Test if routes are accessible
    const routes = [
      '/teacher/course/123/materials',
      '/course/123/materials',
      '/course/123/materials/456/study'
    ];
    
    return routes.map(route => ({
      route,
      accessible: true // This would need actual routing test
    }));
  };

  const testAPI = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch('http://localhost:5000/api/study-materials/course/123', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    return {
      status: response.status,
      ok: response.ok
    };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Study Materials Test Page</h1>
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Quick Tests</h2>
        <div className="flex gap-4 mb-4">
          <button
            onClick={() => runTest('Route Accessibility', testRoutes)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Test Routes
          </button>
          <button
            onClick={() => runTest('API Connection', testAPI)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Test API
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Direct Links</h2>
        <div className="space-y-2">
          <div>
            <Link 
              to="/teacher/course/64f123456789abcdef123456/materials" 
              className="text-blue-600 hover:underline block"
            >
              Teacher Materials Manager (Sample Course ID)
            </Link>
          </div>
          <div>
            <Link 
              to="/course/64f123456789abcdef123456/materials" 
              className="text-blue-600 hover:underline block"
            >
              Student Materials List (Sample Course ID)
            </Link>
          </div>
          <div>
            <Link 
              to="/course/64f123456789abcdef123456/materials/64f789abcdef123456789abc/study" 
              className="text-blue-600 hover:underline block"
            >
              Adaptive Study Interface (Sample IDs)
            </Link>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Results</h2>
        <div className="space-y-2">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-3 rounded border ${
                result.status === 'PASS' 
                  ? 'border-green-300 bg-green-50 text-green-800' 
                  : 'border-red-300 bg-red-50 text-red-800'
              }`}
            >
              <div className="font-semibold">{result.name}: {result.status}</div>
              {result.result && (
                <pre className="mt-2 text-sm">{JSON.stringify(result.result, null, 2)}</pre>
              )}
              {result.error && (
                <div className="mt-2 text-sm">{result.error}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Form Test</h2>
        <div className="max-w-md">
          <input
            type="text"
            placeholder="Test input visibility"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900 mb-2"
          />
          <textarea
            placeholder="Test textarea visibility"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900 mb-2"
          />
          <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900">
            <option value="">Test select visibility</option>
            <option value="test">Test Option</option>
          </select>
        </div>
      </div>

      <div>
        <Link to="/" className="text-blue-600 hover:underline">← Back to Home</Link>
      </div>
    </div>
  );
};

export default TestStudyMaterials;
