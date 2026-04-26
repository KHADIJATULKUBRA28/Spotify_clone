import { Heart, Play, Music, BarChart3 } from 'lucide-react'
import { usePlayerStore } from '../stores/playerStore'
import { useState, useEffect } from 'react'
import { favoriteService } from '../services'

const SongCard = ({ song, songs, index, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const { setCurrentSong, setPlaylist, currentSong, isPlaying } = usePlayerStore()

  // Check favorite status on mount
  useEffect(() => {
    const checkFav = async () => {
      try {
        const res = await favoriteService.checkFavorite(song.id)
        setIsFavorite(res.data.is_favorite)
      } catch {
        // silent - user might not be authed for this check
      }
    }
    checkFav()
  }, [song.id])

  const handlePlay = () => {
    setCurrentSong(song, index || 0)
    if (songs && songs.length > 0) {
      setPlaylist(songs)
    } else {
      setPlaylist([song])
    }
  }

  const handleToggleFavorite = async (e) => {
    e.stopPropagation()
    try {
      if (isFavorite) {
        await favoriteService.removeFavorite(song.id)
      } else {
        await favoriteService.addFavorite(song.id)
      }
      setIsFavorite(!isFavorite)
      onFavoriteChange?.()
    } catch (error) {
      console.error('Failed to toggle favorite:', error)
    }
  }

  const isCurrentlyPlaying = currentSong?.id === song.id && isPlaying

  return (
    <div className="song-card glass-card rounded-xl p-3 cursor-pointer group animate-fade-in">
      {/* Thumbnail */}
      <div className="relative mb-3 aspect-square rounded-lg overflow-hidden bg-spotify-darker">
        {song.thumbnail_url ? (
          <img
            src={song.thumbnail_url}
            alt={song.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-accent-gradient">
            <Music size={40} className="text-white/80" />
          </div>
        )}

        {/* Play overlay */}
        <div className="play-overlay absolute inset-0 flex items-center justify-center bg-black/50 opacity-0">
          <button
            onClick={handlePlay}
            className="w-12 h-12 rounded-full bg-spotify-accent hover:bg-spotify-accent-light hover:scale-110 transition-all flex items-center justify-center shadow-xl shadow-spotify-accent/30"
          >
            <Play size={22} className="text-black ml-0.5" fill="currentColor" />
          </button>
        </div>

        {/* Currently playing indicator */}
        {isCurrentlyPlaying && (
          <div className="absolute bottom-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full bg-spotify-accent/90 backdrop-blur-sm">
            <div className="equalizer" style={{ height: '14px' }}>
              <div className="equalizer-bar animate-equalizer-1" style={{ background: '#000' }} />
              <div className="equalizer-bar animate-equalizer-2" style={{ background: '#000' }} />
              <div className="equalizer-bar animate-equalizer-3" style={{ background: '#000' }} />
            </div>
            <span className="text-[10px] font-bold text-black">PLAYING</span>
          </div>
        )}

        {/* Genre badge */}
        {song.genre && (
          <div className="absolute top-2 left-2">
            <span className="genre-badge text-[10px] font-medium text-spotify-accent px-2 py-0.5 rounded-full">
              {song.genre}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="font-semibold text-sm truncate text-white group-hover:text-spotify-accent transition-colors">
        {song.title}
      </h3>
      <p className="text-xs text-gray-400 truncate mt-0.5">{song.artist}</p>
      {song.album && <p className="text-[11px] text-gray-500 truncate mt-0.5">{song.album}</p>}

      {/* Footer */}
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-500 tabular-nums">
            {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
          </span>
          {song.play_count > 0 && (
            <span className="text-[11px] text-gray-500 flex items-center gap-0.5">
              <BarChart3 size={10} />
              {song.play_count > 1000
                ? `${(song.play_count / 1000).toFixed(1)}k`
                : song.play_count}
            </span>
          )}
        </div>
        <button
          onClick={handleToggleFavorite}
          className={`p-1.5 rounded-full transition-all ${
            isFavorite
              ? 'text-spotify-accent scale-110'
              : 'text-gray-500 hover:text-spotify-accent hover:scale-110'
          }`}
        >
          <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}

export default SongCard
