import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { BookOpen, Clock, Download, FileText, Video, Image, Music, Filter, Eye } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { cachedGet } from '../../utils/api';

const StudentMaterialsList = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedChapter, setSelectedChapter] = useState('all');

  const fetchCourseAndMaterials = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch both course details and materials in parallel with caching
      const [courseResponse, materialsResponse] = await Promise.all([
        cachedGet(`/course/${courseId}`, 'course', 10 * 60 * 1000, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        cachedGet(`/study-materials/course/${courseId}`, 'study-materials', 3 * 60 * 1000, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setCourse(courseResponse.data);
      setMaterials(materialsResponse.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load course materials');
      navigate(`/course/${courseId}`);
    } finally {
      setLoading(false);
    }
  }, [courseId, navigate]);

  // Filter materials based on difficulty and chapter
  useEffect(() => {
    let filtered = materials;

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(material => material.difficulty === selectedDifficulty);
    }

    if (selectedChapter !== 'all') {
      filtered = filtered.filter(material => material.chapter === selectedChapter);
    }

    setFilteredMaterials(filtered);
  }, [materials, selectedDifficulty, selectedChapter]);

  useEffect(() => {
    fetchCourseAndMaterials();
  }, [fetchCourseAndMaterials]);

  // Get unique chapters for filtering
  const getUniqueChapters = () => {
    const chapters = materials.map(material => material.chapter || 'General');
    return [...new Set(chapters)];
  };

  // Download material function
  const downloadMaterial = async (materialId, fileName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/study-materials/download/${materialId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success('Download started successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download material');
    }
  };

  // View material in new tab
  const viewMaterial = async (materialId) => {
    try {
      const token = localStorage.getItem('token');
      const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/study-materials/download/${materialId}?view=true&token=${token}`;
      window.open(url, '_blank');
    } catch (error) {
      console.error('View error:', error);
      toast.error('Failed to open material');
    }
  };

  const getFileIcon = (fileType) => {
    const type = fileType.toLowerCase();
    if (type.includes('.pdf') || type.includes('.doc')) return <FileText className="text-red-500" size={24} />;
    if (type.includes('.mp4') || type.includes('.avi')) return <Video className="text-blue-500" size={24} />;
    if (type.includes('.jpg') || type.includes('.png')) return <Image className="text-green-500" size={24} />;
    if (type.includes('.mp3') || type.includes('.wav')) return <Music className="text-purple-500" size={24} />;
    return <BookOpen className="text-gray-500" size={24} />;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="text-sm breadcrumbs mb-4">
          <Link to="/student/enrolled" className="text-blue-600 hover:underline">My Courses</Link>
          <span className="mx-2">/</span>
          <Link to={`/course/${courseId}`} className="text-blue-600 hover:underline">{course?.title}</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-500">Study Materials</span>
        </nav>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📚 Study Materials
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Course: {course?.title} • {filteredMaterials.length} of {materials.length} materials
            </p>
          </div>
          
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Back to Course
          </button>
        </div>

        {/* Filters */}
        {materials.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Filter size={20} className="text-gray-600" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Filter Materials</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Difficulty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Difficulty Level
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Difficulties</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Chapter Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chapter
                </label>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="all">All Chapters</option>
                  {getUniqueChapters().map((chapter) => (
                    <option key={chapter} value={chapter}>
                      {chapter}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Materials List */}
      {materials.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
            No study materials available yet
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Your instructor will upload materials here for you to study.
          </p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="text-center py-12">
          <Filter size={64} className="mx-auto text-gray-400 mb-4" />
          <p className="text-xl text-gray-500 dark:text-gray-400 mb-4">
            No materials match your filters
          </p>
          <p className="text-gray-500 dark:text-gray-400">
            Try adjusting your difficulty or chapter filters to see more materials.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMaterials.map((material) => (
            <div
              key={material._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-3 mb-4">
                {getFileIcon(material.fileType)}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {material.title}
                  </h3>
                  <p className="text-xs text-gray-500">{material.fileName}</p>
                </div>
              </div>

              {material.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {material.description}
                </p>
              )}

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Chapter:</span>
                  <span className="font-medium">{material.chapter || 'General'}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Difficulty:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(material.difficulty)}`}>
                    {material.difficulty}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Study Time:</span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} />
                    {material.estimatedStudyTime} min
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">File Size:</span>
                  <span>{formatFileSize(material.fileSize)}</span>
                </div>
              </div>
              {/* Inline Preview Button for PDFs/images */}
              {['.pdf', '.png', '.jpg', '.jpeg'].includes(material.fileType) && (
                <Link
                  to={`/student/materials/${material._id}/preview`}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 text-sm mb-2"
                >
                  <Eye size={14} />
                  Preview Inline
                </Link>
              )}

              {material.keywords && material.keywords.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {material.keywords.slice(0, 3).map((keyword, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                      >
                        {keyword}
                      </span>
                    ))}
                    {material.keywords.length > 3 && (
                      <span className="text-xs text-gray-500">
                        +{material.keywords.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div className="text-xs text-gray-500 mb-4">
                Uploaded: {new Date(material.uploadDate).toLocaleDateString()}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => downloadMaterial(material._id, material.fileName)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Download size={14} />
                    Download
                  </button>
                  
                  <button
                    onClick={() => viewMaterial(material._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <Eye size={14} />
                    View
                  </button>
                </div>
                
                <Link
                  to={`/course/${courseId}/materials/${material._id}/study`}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <BookOpen size={14} />
                  Start Studying
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentMaterialsList;
