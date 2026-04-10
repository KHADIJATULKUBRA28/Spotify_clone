import { Heart, Play } from 'lucide-react'
import { usePlayerStore } from '../stores/playerStore'
import { useState } from 'react'
import { favoriteService } from '../services'

const SongCard = ({ song, onFavoriteChange }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  const { setCurrentSong, setPlaylist } = usePlayerStore()

  const handlePlay = () => {
    setCurrentSong(song)
    setPlaylist([song])
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

  return (
    <div className="bg-spotify-gray hover:bg-spotify-light-gray rounded-lg p-4 transition group cursor-pointer">
      {/* Thumbnail */}
      <div className="relative mb-4 aspect-square rounded-lg bg-spotify-dark overflow-hidden">
        <img
          src={song.thumbnail_url || 'https://via.placeholder.com/160'}
          alt={song.title}
          className="w-full h-full object-cover"
        />
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
        >
          <Play size={32} className="text-spotify-accent ml-1" fill="currentColor" />
        </button>
      </div>

      {/* Info */}
      <h3 className="font-semibold truncate text-white">{song.title}</h3>
      <p className="text-sm text-gray-400 truncate">{song.artist}</p>
      {song.album && <p className="text-xs text-gray-500 truncate">{song.album}</p>}

      {/* Footer */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {Math.floor(song.duration / 60)}:{String(Math.floor(song.duration % 60)).padStart(2, '0')}
        </span>
        <button
          onClick={handleToggleFavorite}
          className={`p-1 rounded transition ${
            isFavorite
              ? 'text-spotify-accent'
              : 'text-gray-400 hover:text-spotify-accent'
          }`}
        >
          <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  )
}

export default SongCard
