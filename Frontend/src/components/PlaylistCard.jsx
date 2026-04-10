import { Music, Play, MoreVertical } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePlayerStore } from '../stores/playerStore'

const PlaylistCard = ({ playlist, onPlay }) => {
  const navigate = useNavigate()
  const { setCurrentSong, setPlaylist } = usePlayerStore()

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`)
  }

  const handlePlay = (e) => {
    e.stopPropagation()
    if (playlist.songs && playlist.songs.length > 0) {
      setCurrentSong(playlist.songs[0], 0)
      setPlaylist(playlist.songs)
      onPlay?.()
    }
  }

  const songCount = playlist.songs?.length || 0

  return (
    <div
      onClick={handleClick}
      className="bg-spotify-gray hover:bg-spotify-light-gray rounded-lg p-4 transition group cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative mb-4 aspect-square rounded-lg bg-spotify-dark overflow-hidden">
        {playlist.thumbnail_url ? (
          <img
            src={playlist.thumbnail_url}
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-spotify-accent to-purple-600">
            <Music size={48} />
          </div>
        )}
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition"
        >
          <Play size={32} className="text-spotify-accent ml-1" fill="currentColor" />
        </button>
      </div>

      {/* Info */}
      <h3 className="font-semibold truncate text-white">{playlist.name}</h3>
      <p className="text-sm text-gray-400 mt-1">
        {playlist.user?.username || 'Unknown'}
      </p>
      <p className="text-xs text-gray-500">
        {songCount} song{songCount !== 1 ? 's' : ''}
      </p>

      {playlist.description && (
        <p className="text-xs text-gray-400 truncate mt-2 line-clamp-2">
          {playlist.description}
        </p>
      )}
    </div>
  )
}

export default PlaylistCard
