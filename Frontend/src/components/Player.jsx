import { useRef, useEffect } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  Repeat,
  Repeat1,
  Shuffle,
} from 'lucide-react'
import { usePlayerStore } from '../stores/playerStore'
import { songService, recentlyPlayedService } from '../services'

const Player = () => {
  const audioRef = useRef(null)
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeat,
    shuffle,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    setVolume,
    setRepeat,
    setShuffle,
    playNext,
    playPrevious,
  } = usePlayerStore()

  useEffect(() => {
    if (!audioRef.current || !currentSong) return

    if (isPlaying) {
      audioRef.current.play()
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying, currentSong])

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value)
    setCurrentTime(newTime)
    if (audioRef.current) {
      audioRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const handleEnded = () => {
    if (repeat === 'one') {
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      playNext()
    }
  }

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  const handleNextClick = () => {
    playNext()
    // Add to recently played
    if (currentSong?.id) {
      recentlyPlayedService.addToRecentlyPlayed(currentSong.id)
    }
  }

  return (
    <div className="bg-spotify-gray border-t border-spotify-light-gray p-4">
      {/* Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        volume={volume / 100}
        crossOrigin="anonymous"
        src={currentSong ? songService.streamSong(currentSong.id) : ''}
      />

      {/* Currently Playing Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 truncate">
          {currentSong
            ? `${currentSong.artist} - ${currentSong.title}`
            : 'No song playing'}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 space-y-2">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-spotify-light-gray rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${
              (currentTime / duration) * 100 || 0
            }%, #404040 ${(currentTime / duration) * 100 || 0}%, #404040 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 mb-4">
        {/* Shuffle */}
        <button
          onClick={() => setShuffle(!shuffle)}
          className={`p-2 rounded-lg transition ${
            shuffle
              ? 'bg-spotify-accent text-black'
              : 'hover:bg-spotify-light-gray'
          }`}
          title="Shuffle"
        >
          <Shuffle size={18} />
        </button>

        {/* Previous */}
        <button
          onClick={playPrevious}
          disabled={!currentSong}
          className="p-2 rounded-lg hover:bg-spotify-light-gray disabled:opacity-50"
          title="Previous"
        >
          <SkipBack size={20} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={handlePlayPause}
          disabled={!currentSong}
          className="p-3 rounded-full bg-spotify-accent text-black hover:bg-green-500 disabled:opacity-50 transition"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>

        {/* Next */}
        <button
          onClick={handleNextClick}
          disabled={!currentSong}
          className="p-2 rounded-lg hover:bg-spotify-light-gray disabled:opacity-50"
          title="Next"
        >
          <SkipForward size={20} />
        </button>

        {/* Repeat */}
        <button
          onClick={() => {
            if (repeat === 'off') setRepeat('all')
            else if (repeat === 'all') setRepeat('one')
            else setRepeat('off')
          }}
          className={`p-2 rounded-lg transition ${
            repeat !== 'off'
              ? 'bg-spotify-accent text-black'
              : 'hover:bg-spotify-light-gray'
          }`}
          title={`Repeat: ${repeat}`}
        >
          {repeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-2">
        <Volume2 size={18} />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-32 h-1 bg-spotify-light-gray rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume}%, #404040 ${volume}%, #404040 100%)`,
          }}
        />
        <span className="text-xs text-gray-400 w-8">{Math.round(volume)}%</span>
      </div>
    </div>
  )
}

export default Player
