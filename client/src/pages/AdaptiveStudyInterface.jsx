import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, Download, BookOpen, Headphones, Video, FileText, Globe, Zap, Target, Star, Volume2, Settings } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api, { cachedGet, apiPost } from '../utils/api';
import VoicePlayer from '../components/VoicePlayer';
import axios from 'axios';

const AdaptiveStudyInterface = () => {
  const { courseId, materialId } = useParams();
  const navigate = useNavigate();
  
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [studyMode, setStudyMode] = useState('medium');
  const [availableTime, setAvailableTime] = useState(30);
  const [adaptiveContent, setAdaptiveContent] = useState(null);
  const [generatingContent, setGeneratingContent] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Voice narration state
  const [user, setUser] = useState(null);
  const [selectedCharacter, setSelectedCharacter] = useState('Professor Alex');
  const [narrationUrl, setNarrationUrl] = useState(null);
  const [generatingNarration, setGeneratingNarration] = useState(false);
  const [showNarrationPanel, setShowNarrationPanel] = useState(false);
  const [narrationText, setNarrationText] = useState('');
  
  // Session tracking state
  const [sessionId, setSessionId] = useState(null);
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [usedNarration, setUsedNarration] = useState(false);

  const studyModes = {
    quick: {
      name: 'Quick Review',
      icon: <Zap className="text-yellow-500" size={20} />,
      time: '5-10 minutes',
      description: 'Key points and highlights',
      color: 'bg-yellow-50 border-yellow-200 text-yellow-800'
    },
    medium: {
      name: 'Standard Study',
      icon: <Target className="text-blue-500" size={20} />,
      time: '15-30 minutes',
      description: 'Comprehensive overview with examples',
      color: 'bg-blue-50 border-blue-200 text-blue-800'
    },
    detailed: {
      name: 'Deep Dive',
      icon: <Star className="text-purple-500" size={20} />,
      time: '45-60 minutes',
      description: 'In-depth analysis with multimedia',
      color: 'bg-purple-50 border-purple-200 text-purple-800'
    }
  };

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' }
  ];

  const fetchMaterial = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch user profile to get preferred character
      const userResponse = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (userResponse.data.user?.favoriteCharacter) {
        setSelectedCharacter(userResponse.data.user.favoriteCharacter);
      }
      setUser(userResponse.data.user);
      
      // Fetch study material
      const response = await cachedGet(`/study-materials/${materialId}`, 'study-materials', 3 * 60 * 1000, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMaterial(response.data);
    } catch (error) {
      console.error('Error fetching material:', error);
      toast.error('Failed to load study material');
      navigate(`/course/${courseId}`);
    } finally {
      setLoading(false);
    }
  }, [materialId, courseId, navigate]);

  useEffect(() => {
    fetchMaterial();
    startStudySession();
    
    // Cleanup: Save session data on unmount
    return () => {
      if (sessionId) {
        endStudySession();
      }
    };
  }, [fetchMaterial]);
  
  const startStudySession = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/analytics/session/start',
        {
          materialId,
          courseId,
          studyMode,
          availableTime,
          characterUsed: selectedCharacter,
          language: selectedLanguage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setSessionId(response.data.sessionId);
      setSessionStartTime(Date.now());
    } catch (error) {
      console.error('Error starting session:', error);
    }
  };
  
  const endStudySession = async () => {
    if (!sessionId || !sessionStartTime) return;
    
    try {
      const token = localStorage.getItem('token');
      const timeSpent = Math.floor((Date.now() - sessionStartTime) / 60000); // minutes
      
      await axios.put(
        `http://localhost:5000/api/analytics/session/${sessionId}`,
        {
          timeSpent,
          completionPercentage: adaptiveContent ? 100 : 50,
          usedVoiceNarration: usedNarration
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (error) {
      console.error('Error ending session:', error);
    }
  };

  const generateNarration = async (textToNarrate) => {
    setGeneratingNarration(true);
    try {
      const token = localStorage.getItem('token');
      
      // Validate text
      if (!textToNarrate || textToNarrate.trim().length === 0) {
        toast.error('No text to narrate');
        return;
      }
      
      // Limit text to 4000 characters for API
      const limitedText = textToNarrate.substring(0, 4000);
      
      console.log('Narration request:', {
        textLength: limitedText.length,
        character: selectedCharacter,
        textPreview: limitedText.substring(0, 100)
      });
      
      const response = await axios.post(
        'http://localhost:5000/api/openai/character-narration',
        {
          text: limitedText,
          character: selectedCharacter,
          language: 'en-US'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setNarrationUrl(response.data.audioUrl);
      setShowNarrationPanel(true);
      setUsedNarration(true); // Track narration usage
      toast.success(`${selectedCharacter} is ready to narrate!`);
    } catch (error) {
      console.error('Error generating narration:', error);
      console.error('Error response:', error.response?.data);
      toast.error(error.response?.data?.error || 'Failed to generate narration. Please try again.');
    } finally {
      setGeneratingNarration(false);
    }
  };

  const handleGenerateContentNarration = async () => {
    if (!adaptiveContent?.content) {
      toast.error('Please generate adaptive content first');
      return;
    }
    
    // Extract plain text from HTML
    const div = document.createElement('div');
    div.innerHTML = adaptiveContent.content;
    const plainText = div.textContent || div.innerText || '';
    
    setNarrationText(plainText);
    await generateNarration(plainText);
  };

  const handleGenerateMaterialNarration = async () => {
    if (!material?.description) {
      toast.error('No material description to narrate');
      return;
    }
    
    setNarrationText(material.description);
    await generateNarration(material.description);
  };

  const generateAdaptiveContent = async () => {
    setGeneratingContent(true);
    try {
      const token = localStorage.getItem('token');
      const response = await apiPost(
        `/study-materials/ai-content/${materialId}`,
        {
          studyMode,
          timeConstraint: availableTime,
          language: selectedLanguage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setAdaptiveContent(response.data);
      toast.success('Study content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error('Failed to generate adaptive content');
    } finally {
      setGeneratingContent(false);
    }
  };

  const downloadOriginalFile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(
        `/study-materials/download/${materialId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', material.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('File downloaded successfully!');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Failed to download file');
    }
  };

  const translateContent = async (targetLanguage) => {
    if (!adaptiveContent) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await apiPost(
        `/study-materials/translate/${materialId}`,
        {
          content: adaptiveContent.content,
          targetLanguage,
          sourceLanguage: selectedLanguage
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setAdaptiveContent({
        ...adaptiveContent,
        content: response.data.translatedContent
      });
      setSelectedLanguage(targetLanguage);
      toast.success(`Content translated to ${languages.find(l => l.code === targetLanguage)?.name}`);
    } catch (error) {
      console.error('Error translating content:', error);
      toast.error('Translation failed');
    }
  };

  const getFileIcon = (fileType) => {
    if (!fileType) return <BookOpen className="text-gray-500" size={24} />;
    const type = fileType.toLowerCase();
    if (type.includes('.pdf') || type.includes('.doc')) return <FileText className="text-red-500" size={24} />;
    if (type.includes('.mp4') || type.includes('.avi')) return <Video className="text-blue-500" size={24} />;
    if (type.includes('.mp3') || type.includes('.wav')) return <Headphones className="text-purple-500" size={24} />;
    return <BookOpen className="text-gray-500" size={24} />;
  };

  const formatTime = (minutes) => {
    if (minutes < 60) return `${minutes}min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}min`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Material Not Found
        </h1>
        <button
          onClick={() => navigate(`/course/${courseId}`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          Back to Course
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          {getFileIcon(material.fileType)}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {material.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {material.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-center">
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {material.chapter || 'General'}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm ${
            material.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
            material.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {material.difficulty}
          </span>
          <span className="flex items-center gap-1 text-gray-600">
            <Clock size={16} />
            {formatTime(material.estimatedStudyTime)}
          </span>
        </div>
      </div>

      {/* Study Mode Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Choose Your Study Mode
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(studyModes).map(([mode, config]) => (
            <button
              key={mode}
              onClick={() => setStudyMode(mode)}
              className={`p-4 rounded-lg border-2 transition-all ${
                studyMode === mode 
                  ? config.color 
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {config.icon}
                <span className="font-semibold">{config.name}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {config.time}
              </p>
              <p className="text-xs text-gray-500">
                {config.description}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 items-center mb-6">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Available Time:
            </label>
            <select
              value={availableTime}
              onChange={(e) => setAvailableTime(parseInt(e.target.value))}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value={5}>5 minutes</option>
              <option value={10}>10 minutes</option>
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Language:
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={generateAdaptiveContent}
            disabled={generatingContent}
            className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            {generatingContent ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Generating...
              </>
            ) : (
              <>
                <BookOpen size={20} />
                Generate Study Content
              </>
            )}
          </button>

          <button
            onClick={handleGenerateMaterialNarration}
            disabled={generatingNarration}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
            title="Generate narration with your selected character"
          >
            {generatingNarration ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Narrating...
              </>
            ) : (
              <>
                <Headphones size={20} />
                Narrate with {selectedCharacter}
              </>
            )}
          </button>

          <button
            onClick={downloadOriginalFile}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            <Download size={20} />
            Download Original
          </button>

          <button
            onClick={() => navigate('/student/character-settings')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center gap-2"
            title="Change your study guide character"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>

      {/* Voice Player Panel */}
      {showNarrationPanel && narrationUrl && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg shadow-md p-6 mb-8 border border-purple-200 dark:border-purple-800">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
              <Volume2 size={20} className="text-purple-600" />
              Study Guide Narration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Listen to the material being narrated by your selected study guide
            </p>
          </div>
          <VoicePlayer
            audioUrl={narrationUrl}
            character={selectedCharacter}
            onEnded={() => {
              toast.success('Narration complete!');
            }}
          />
        </div>
      )}

      {/* Adaptive Content Display */}
      {adaptiveContent && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Adaptive Study Content
            </h2>
            
            <div className="flex gap-4">
              <button
                onClick={handleGenerateContentNarration}
                disabled={generatingNarration}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
              >
                {generatingNarration ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Narrating...
                  </>
                ) : (
                  <>
                    <Headphones size={16} />
                    Narrate Content
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                <Globe size={16} className="text-gray-500" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => translateContent(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-sm"
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none">
            <div 
              className="text-gray-700 dark:text-gray-300 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: adaptiveContent.content }}
            />
          </div>

          {adaptiveContent.keywords && adaptiveContent.keywords.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Key Topics
              </h3>
              <div className="flex flex-wrap gap-2">
                {adaptiveContent.keywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-3 py-1 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>
                Study Mode: {studyModes[studyMode].name}
              </span>
              <span>
                Estimated Time: {formatTime(adaptiveContent.estimatedTime || availableTime)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Original Content Section - when no adaptive content */}
      {!adaptiveContent && material && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Material Overview
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            {material.description}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Click "Generate Study Content" to create personalized study material based on your selected study mode and available time.
          </p>
        </div>
      )}

      {/* Keywords from Original Material */}
      {material?.keywords && material.keywords.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Original Material Keywords
          </h3>
          <div className="flex flex-wrap gap-2">
            {material.keywords.map((keyword, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdaptiveStudyInterface;
