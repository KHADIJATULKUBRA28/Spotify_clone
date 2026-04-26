import { useRef, useEffect, useState } from 'react'
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Volume1,
  Repeat,
  Repeat1,
  Shuffle,
  Music,
} from 'lucide-react'
import { usePlayerStore } from '../stores/playerStore'
import { songService, recentlyPlayedService } from '../services'

const Player = () => {
  const audioRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)
  const [prevVolume, setPrevVolume] = useState(100)
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

  // Handle song change - load and autoplay
  useEffect(() => {
    if (!audioRef.current || !currentSong) return

    const audio = audioRef.current
    audio.src = songService.streamSong(currentSong.id)
    audio.load()

    const playPromise = audio.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true)
        })
        .catch((err) => {
          console.log('Autoplay prevented:', err)
          setIsPlaying(false)
        })
    }

    // Track recently played
    try {
      recentlyPlayedService.addToRecentlyPlayed(currentSong.id)
    } catch (e) {
      // silent
    }
  }, [currentSong?.id])

  // Handle play/pause toggle
  useEffect(() => {
    if (!audioRef.current || !currentSong) return

    if (isPlaying) {
      audioRef.current.play().catch(() => {})
    } else {
      audioRef.current.pause()
    }
  }, [isPlaying])

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100
    }
  }, [volume])

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
    setIsMuted(newVolume === 0)
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100
    }
  }

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume)
      setIsMuted(false)
    } else {
      setPrevVolume(volume)
      setVolume(0)
      setIsMuted(true)
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

  const progressPercent = duration ? (currentTime / duration) * 100 : 0

  const VolumeIcon = isMuted || volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2

  return (
    <div className="h-[88px] glass-strong border-t border-white/5 px-4 flex items-center gap-4 relative z-50">
      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        crossOrigin="anonymous"
        preload="auto"
      />

      {/* Left - Song Info */}
      <div className="flex items-center gap-3 w-[280px] min-w-[180px]">
        {currentSong ? (
          <>
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 shadow-lg now-playing-art">
              {currentSong.thumbnail_url ? (
                <img
                  src={currentSong.thumbnail_url}
                  alt={currentSong.title}
                  className={`w-full h-full object-cover ${isPlaying ? '' : 'opacity-80'}`}
                />
              ) : (
                <div className="w-full h-full bg-accent-gradient flex items-center justify-center">
                  <Music size={24} className="text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-white">{currentSong.title}</p>
              <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
            </div>
            {isPlaying && (
              <div className="equalizer ml-1">
                <div className="equalizer-bar animate-equalizer-1" />
                <div className="equalizer-bar animate-equalizer-2" />
                <div className="equalizer-bar animate-equalizer-3" />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-lg bg-spotify-gray flex items-center justify-center">
              <Music size={24} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">No song playing</p>
              <p className="text-xs text-gray-600">Select a song to start</p>
            </div>
          </div>
        )}
      </div>

      {/* Center - Controls + Progress */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-[600px] mx-auto gap-1.5">
        {/* Playback Controls */}
        <div className="flex items-center gap-4">
          {/* Shuffle */}
          <button
            onClick={() => setShuffle(!shuffle)}
            className={`p-1.5 rounded-full transition-all ${
              shuffle
                ? 'text-spotify-accent'
                : 'text-gray-400 hover:text-white'
            }`}
            title="Shuffle"
          >
            <Shuffle size={16} />
          </button>

          {/* Previous */}
          <button
            onClick={playPrevious}
            disabled={!currentSong}
            className="p-1.5 text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:text-gray-300 transition"
            title="Previous"
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          {/* Play/Pause */}
          <button
            onClick={handlePlayPause}
            disabled={!currentSong}
            className="w-9 h-9 rounded-full bg-white text-black hover:scale-105 disabled:opacity-30 transition-all flex items-center justify-center shadow-lg"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>

          {/* Next */}
          <button
            onClick={playNext}
            disabled={!currentSong}
            className="p-1.5 text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:text-gray-300 transition"
            title="Next"
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          {/* Repeat */}
          <button
            onClick={() => {
              if (repeat === 'off') setRepeat('all')
              else if (repeat === 'all') setRepeat('one')
              else setRepeat('off')
            }}
            className={`p-1.5 rounded-full transition-all ${
              repeat !== 'off'
                ? 'text-spotify-accent'
                : 'text-gray-400 hover:text-white'
            }`}
            title={`Repeat: ${repeat}`}
          >
            {repeat === 'one' ? <Repeat1 size={16} /> : <Repeat size={16} />}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full flex items-center gap-2">
          <span className="text-[11px] text-gray-400 w-10 text-right tabular-nums">
            {formatTime(currentTime)}
          </span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1"
            style={{
              background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${progressPercent}%, rgba(255,255,255,0.1) ${progressPercent}%, rgba(255,255,255,0.1) 100%)`,
            }}
          />
          <span className="text-[11px] text-gray-400 w-10 tabular-nums">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right - Volume */}
      <div className="flex items-center gap-2 w-[180px] justify-end">
        <button
          onClick={toggleMute}
          className="p-1.5 text-gray-400 hover:text-white transition"
        >
          <VolumeIcon size={18} />
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="w-24"
          style={{
            background: `linear-gradient(to right, #1DB954 0%, #1DB954 ${volume}%, rgba(255,255,255,0.1) ${volume}%, rgba(255,255,255,0.1) 100%)`,
          }}
        />
      </div>
    </div>
  )
}

export default Player
