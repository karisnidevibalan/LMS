import React, { useState, useEffect } from 'react';
import { Volume2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const CharacterSelector = ({ selectedCharacter, onCharacterSelect, showPreview = true }) => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/openai/characters');
        const data = await response.json();
        if (data.success) {
          setCharacters(data.characters);
        }
      } catch (error) {
        console.error('Error fetching characters:', error);
        toast.error('Failed to load characters');
        // Fallback characters
        setCharacters([
          { name: 'Professor Alex', voice: 'onyx', description: 'Professional educator', tone: 'formal' },
          { name: 'Friendly Charlie', voice: 'alloy', description: 'Enthusiastic guide', tone: 'casual' },
          { name: 'Wise Sage', voice: 'echo', description: 'Thoughtful mentor', tone: 'meditative' },
          { name: 'Energy Eva', voice: 'fable', description: 'Dynamic instructor', tone: 'energetic' },
          { name: 'Calm Jordan', voice: 'shimmer', description: 'Patient tutor', tone: 'soothing' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  const handlePreview = async (character) => {
    if (!showPreview) return;
    
    try {
      setPlayingId(character.name);
      
      // Generate preview narration
      const previewText = `Hello! I'm ${character.name}, your ${character.tone} study guide. I'm excited to help you learn today!`;
      
      const response = await fetch('http://localhost:5000/api/openai/character-narration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          text: previewText,
          character: character.name,
          language: 'en-US',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate preview');
      }

      const data = await response.json();
      
      // Play the audio
      const audio = new Audio(data.audioUrl);
      audio.onended = () => setPlayingId(null);
      audio.play();
    } catch (error) {
      console.error('Error playing preview:', error);
      toast.error('Failed to play preview');
      setPlayingId(null);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
          Choose Your Study Guide
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Select a character who will narrate your study materials
        </p>
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {characters.map((character) => (
          <motion.div
            key={character.name}
            variants={cardVariants}
            onMouseEnter={() => setHoveredId(character.name)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onCharacterSelect(character.name)}
            className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedCharacter === character.name
                ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-teal-300'
            }`}
          >
            {/* Selection checkmark */}
            {selectedCharacter === character.name && (
              <div className="absolute top-2 right-2 bg-teal-500 text-white rounded-full p-1">
                <Check size={16} />
              </div>
            )}

            {/* Character info */}
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold">
                  {character.name.charAt(0)}
                </div>
                <h4 className="font-semibold text-gray-800 dark:text-white">
                  {character.name}
                </h4>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 ml-12">
                {character.description}
              </p>
            </div>

            {/* Tone badge */}
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                {character.tone}
              </span>
            </div>

            {/* Preview button */}
            {showPreview && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePreview(character);
                }}
                disabled={playingId !== null && playingId !== character.name}
                className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  playingId === character.name
                    ? 'bg-teal-500 text-white'
                    : hoveredId === character.name || selectedCharacter === character.name
                    ? 'bg-teal-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Volume2 size={16} />
                {playingId === character.name ? 'Playing...' : 'Preview'}
              </button>
            )}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CharacterSelector;
