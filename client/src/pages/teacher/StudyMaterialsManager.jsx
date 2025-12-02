import React, { useState, useEffect, useCallback, memo } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Upload, Download, Trash2, FileText, Video, Image, Music, Book, Clock, Star, Tag, Globe, Edit, Users, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import { cachedGet, apiDelete, clearCachePattern } from '../../utils/api';

const StudyMaterialsManager = memo(() => {
  const { courseId } = useParams();
  const location = useLocation();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  const [uploadForm, setUploadForm] = useState({
    title: '',
    description: '',
    chapter: '',
    difficulty: 'medium',
    studyTime: 30,
    keywords: '',
    file: null
  });

  const fetchCourseAndMaterials = useCallback(async () => {
    try {
      // Fetch both course details and materials with caching
      const [courseResponse, materialsResponse] = await Promise.all([
        cachedGet(`/course/${courseId}`),
        cachedGet(`/study-materials/course/${courseId}`)
      ]);
      
      setCourse(courseResponse.data);
      setMaterials(materialsResponse.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load course data');
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchCourseAndMaterials();
    
    // Check if this is a newly created course
    if (location.state?.newCourse) {
      setShowWelcome(true);
      if (location.state?.message) {
        toast.success(location.state.message, { duration: 5000 });
      }
    }
  }, [fetchCourseAndMaterials, location.state]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.file) {
      toast.error('Please select a file to upload');
      return;
    }

    // Prevent double submission
    if (uploadLoading) return;

    setUploadLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      
      formData.append('file', uploadForm.file);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('chapter', uploadForm.chapter);
      formData.append('difficulty', uploadForm.difficulty);
      formData.append('studyTime', uploadForm.studyTime);
      formData.append('keywords', uploadForm.keywords);

      const response = await axios.post(`http://localhost:5000/api/study-materials/upload/${courseId}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 second timeout for large files
      });

      // Show auto-extracted keywords in success message
      const { autoExtractedKeywords = [], totalKeywords = 0 } = response.data;
      
      let successMessage = 'Study material uploaded successfully!';
      if (autoExtractedKeywords.length > 0) {
        successMessage += ` 🎯 Auto-extracted ${autoExtractedKeywords.length} keywords`;
        if (totalKeywords > autoExtractedKeywords.length) {
          successMessage += ` (${totalKeywords} total with manual keywords)`;
        }
      }

      // Clear cache and refresh data
      clearCachePattern('study-materials');
      clearCachePattern('course');

      toast.success(successMessage);
      setShowUploadForm(false);
      setUploadForm({
        title: '',
        description: '',
        chapter: '',
        difficulty: 'medium',
        studyTime: 30,
        keywords: '',
        file: null
      });
      fetchCourseAndMaterials();

    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error(error.response?.data?.error || 'Failed to upload file');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleDeleteMaterial = async (materialId) => {
    if (!window.confirm('Are you sure you want to delete this material?')) {
      return;
    }

    try {
      await apiDelete(`/study-materials/${materialId}`);
      
      // Clear cache and refresh data
      clearCachePattern('study-materials');
      toast.success('Material deleted successfully');
      fetchCourseAndMaterials();

    } catch (error) {
      console.error('Error deleting material:', error);
      toast.error('Failed to delete material');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    const iconProps = { size: 20, className: "text-blue-500" };
    
    switch (fileType?.toLowerCase()) {
      case '.pdf':
        return <FileText {...iconProps} className="text-red-500" />;
      case '.doc':
      case '.docx':
        return <FileText {...iconProps} className="text-blue-600" />;
      case '.ppt':
      case '.pptx':
        return <FileText {...iconProps} className="text-orange-500" />;
      case '.mp4':
      case '.avi':
      case '.mkv':
        return <Video {...iconProps} className="text-purple-500" />;
      case '.mp3':
      case '.wav':
        return <Music {...iconProps} className="text-green-500" />;
      case '.jpg':
      case '.jpeg':
      case '.png':
      case '.gif':
        return <Image {...iconProps} className="text-pink-500" />;
      default:
        return <FileText {...iconProps} />;
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading course materials..." />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Welcome Banner for New Course */}
      {showWelcome && materials.length === 0 && (
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-6 shadow-lg">
          <div className="flex items-start gap-4">
            <div className="bg-blue-500 text-white rounded-full p-3">
              <CheckCircle size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                🎉 Course Created Successfully!
              </h2>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Now let's add content to make your course engaging for students. Here are the next steps:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Upload className="text-blue-500" size={20} />
                    <h3 className="font-semibold text-gray-900 dark:text-white">1. Upload Materials</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Add PDF, documents, videos, or audio files for students to study
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Edit className="text-purple-500" size={20} />
                    <h3 className="font-semibold text-gray-900 dark:text-white">2. Edit Details</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Update course information, category, and pricing
                  </p>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="text-green-500" size={20} />
                    <h3 className="font-semibold text-gray-900 dark:text-white">3. Publish</h3>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Make your course visible to students once ready
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setShowWelcome(false);
                  setShowUploadForm(true);
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors shadow-md"
              >
                Upload Your First Material
              </button>
            </div>
            
            <button
              onClick={() => setShowWelcome(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm breadcrumbs mb-4">
          <Link to="/teacher/courses" className="text-blue-600 hover:underline">My Courses</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">{course?.title}</span>
          <span className="mx-2">/</span>
          <span className="text-gray-500">Study Materials</span>
        </nav>
        
        {/* Course Management Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6 shadow-md border border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/teacher/courses"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Edit size={18} />
              Edit Course Details
            </Link>
            
            <Link
              to={`/teacher/course/${courseId}/lectures`}
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Book size={18} />
              Manage Lectures
            </Link>
            
            <Link
              to="/teacher/students"
              className="px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors flex items-center gap-2 font-medium"
            >
              <Users size={18} />
              View Students
            </Link>
            
            <span className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium flex items-center gap-2">
              <Upload size={18} />
              Study Materials (Active)
            </span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📚 Study Materials
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Course: {course?.title} • {materials.length} materials uploaded
            </p>
          </div>
          
          <button
            onClick={() => setShowUploadForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Upload size={20} />
            Upload Material
          </button>
        </div>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Upload Study Material</h3>
            
            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={uploadForm.title}
                    onChange={(e) => setUploadForm({...uploadForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900"
                    placeholder="Enter material title"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Chapter
                  </label>
                  <input
                    type="text"
                    value={uploadForm.chapter}
                    onChange={(e) => setUploadForm({...uploadForm, chapter: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900"
                    placeholder="e.g., Chapter 1, Introduction"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm({...uploadForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900"
                  rows="3"
                  placeholder="Brief description of the material content"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Difficulty Level
                  </label>
                  <select
                    value={uploadForm.difficulty}
                    onChange={(e) => setUploadForm({...uploadForm, difficulty: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Estimated Study Time (minutes)
                  </label>
                  <input
                    type="number"
                    value={uploadForm.studyTime}
                    onChange={(e) => setUploadForm({...uploadForm, studyTime: parseInt(e.target.value) || 30})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  File *
                </label>
                <input
                  type="file"
                  onChange={(e) => setUploadForm({...uploadForm, file: e.target.files[0]})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900"
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md,.jpg,.jpeg,.png,.gif,.mp4,.avi,.mkv,.mp3,.wav"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Keywords (optional - auto-extracted from files!) 🤖
                </label>
                <input
                  type="text"
                  value={uploadForm.keywords}
                  onChange={(e) => setUploadForm({...uploadForm, keywords: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-white text-gray-900"
                  placeholder="Additional keywords (we'll auto-extract from your file content)"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  🤖 Our AI will automatically extract keywords from PDF, Word documents, and text files. Add manual keywords only if needed.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={uploadLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2"
                >
                  {uploadLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Uploading & Extracting...
                    </>
                  ) : (
                    <>
                      <Upload size={16} />
                      Upload & Auto-Extract Keywords
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 dark:text-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Materials List */}
      <div className="grid gap-6">
        {materials.length === 0 ? (
          <div className="text-center py-12">
            <Book size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No study materials yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Upload your first study material to get started
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors inline-flex items-center gap-2"
            >
              <Upload size={20} />
              Upload Material
            </button>
          </div>
        ) : (
          materials.map((material) => (
            <div key={material._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    {getFileIcon(material.fileType)}
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {material.title}
                    </h3>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {material.description}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {material.chapter && (
                      <span className="flex items-center gap-1">
                        <Book size={16} />
                        {material.chapter}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {material.estimatedStudyTime} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Star size={16} />
                      {material.difficulty}
                    </span>
                    <span className="flex items-center gap-1">
                      <Globe size={16} />
                      {formatFileSize(material.fileSize)}
                    </span>
                  </div>

                  {material.keywords && material.keywords.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {material.keywords.slice(0, 3).map((keyword, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full"
                          >
                            <Tag size={12} />
                            {keyword}
                          </span>
                        ))}
                        {material.keywords.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-full">
                            +{material.keywords.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <a
                    href={`http://localhost:5000/api/study-materials/download/${material._id}`}
                    className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Download"
                  >
                    <Download size={20} />
                  </a>
                  <button
                    onClick={() => handleDeleteMaterial(material._id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
});

StudyMaterialsManager.displayName = 'StudyMaterialsManager';

export default StudyMaterialsManager;
