import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, RotateCcw, Zap } from 'lucide-react';

const VoicePlayer = ({ 
  audioUrl, 
  character = 'Professor Alex',
  isPlaying: externalIsPlaying = false,
  onPlayStateChange = () => {},
  onEnded = () => {},
  className = ''
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync with external playing state
  useEffect(() => {
    if (externalIsPlaying && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }, [externalIsPlaying]);

  // Load audio metadata
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      onEnded();
    };
    const handleError = () => {
      setError('Failed to load audio');
      setIsLoading(false);
    };

    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, onEnded]);

  const handlePlayPause = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    const newState = !isPlaying;
    setIsPlaying(newState);
    onPlayStateChange(newState);
  };

  const handleReset = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleSpeedChange = (speed) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
      setPlaybackSpeed(speed);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    setVolume(newVolume);
  };

  const formatTime = (time) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 rounded-lg p-4 border border-teal-200 dark:border-teal-800 ${className}`}
    >
      {/* Audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        crossOrigin="anonymous"
      />

      {/* Error message */}
      {error && (
        <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm rounded">
          {error}
        </div>
      )}

      {/* Character info header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-bold text-lg">
          {character.charAt(0)}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-gray-800 dark:text-white">{character}</h4>
          <p className="text-xs text-gray-600 dark:text-gray-400">AI Study Guide</p>
        </div>
      </div>

      {/* Main controls */}
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handlePlayPause}
          disabled={!audioUrl || isLoading}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 text-white flex items-center justify-center hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="animate-spin">
              <Volume2 size={20} />
            </div>
          ) : isPlaying ? (
            <Pause size={20} />
          ) : (
            <Play size={20} className="ml-1" />
          )}
        </button>

        <button
          onClick={handleReset}
          disabled={!audioUrl || duration === 0}
          className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Reset"
        >
          <RotateCcw size={18} className="text-gray-700 dark:text-gray-300" />
        </button>

        <div className="flex-1 flex items-center gap-2">
          <span className="text-xs text-gray-600 dark:text-gray-400 w-10 text-right">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleProgressChange}
            className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
            style={{
              background: `linear-gradient(to right, #14b8a6 0%, #14b8a6 ${progressPercent}%, #d1d5db ${progressPercent}%, #d1d5db 100%)`,
            }}
          />
          <span className="text-xs text-gray-600 dark:text-gray-400 w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Secondary controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Speed controls */}
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Speed:</span>
          {[0.75, 1, 1.25, 1.5].map((speed) => (
            <button
              key={speed}
              onClick={() => handleSpeedChange(speed)}
              className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                playbackSpeed === speed
                  ? 'bg-teal-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 ml-auto">
          <Volume2 size={16} className="text-gray-600 dark:text-gray-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-20 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-teal-500"
          />
        </div>
      </div>

      {/* Status info */}
      <div className="mt-3 pt-3 border-t border-teal-200 dark:border-teal-800">
        <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1">
          <Zap size={14} className="text-yellow-500" />
          {isPlaying ? 'Now playing' : 'Ready to play'} · Duration: {formatTime(duration)}
        </p>
      </div>
    </motion.div>
  );
};

export default VoicePlayer;
