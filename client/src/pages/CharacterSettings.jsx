import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterSelector from '../components/CharacterSelector';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Save, ArrowLeft } from 'lucide-react';

const CharacterSettings = () => {
  const navigate = useNavigate();
  const [selectedCharacter, setSelectedCharacter] = useState('Professor Alex');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch current user's preferred character
  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user?.favoriteCharacter) {
            setSelectedCharacter(data.user.favoriteCharacter);
          }
        }
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserPreferences();
  }, []);

  const handleSavePreferences = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/user/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          favoriteCharacter: selectedCharacter,
        }),
      });

      if (response.ok) {
        toast.success('Character preference saved successfully!');
        setTimeout(() => {
          navigate('/dashboard');
        }, 500);
      } else {
        toast.error('Failed to save preferences');
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      toast.error('Error saving preferences');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span>Back</span>
          </button>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Character Settings
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Choose your preferred study guide to narrate your learning materials
          </p>
        </div>

        {/* Main content card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-6"
        >
          <CharacterSelector
            selectedCharacter={selectedCharacter}
            onCharacterSelect={setSelectedCharacter}
            showPreview={true}
          />
        </motion.div>

        {/* Current selection info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-teal-50 dark:bg-teal-900/20 border-2 border-teal-200 dark:border-teal-800 rounded-lg p-6 mb-6"
        >
          <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
            Selected Character
          </h3>
          <p className="text-gray-700 dark:text-gray-300">
            <span className="font-bold text-teal-600 dark:text-teal-400">{selectedCharacter}</span>
            {' '}has been selected as your preferred study guide.
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            This character will narrate your study materials by default. You can always change this setting later.
          </p>
        </motion.div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSavePreferences}
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Character
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CharacterSettings;
