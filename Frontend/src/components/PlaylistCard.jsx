import { Music, Play } from 'lucide-react'
import { usePlayerStore } from '../stores/playerStore'

const PlaylistCard = ({ playlist, onPlay }) => {
  const { setCurrentSong, setPlaylist } = usePlayerStore()

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
    <div className="song-card glass-card rounded-xl p-3 cursor-pointer group animate-fade-in">
      {/* Thumbnail */}
      <div className="relative mb-3 aspect-square rounded-lg overflow-hidden bg-spotify-darker">
        {playlist.thumbnail_url ? (
          <img
            src={playlist.thumbnail_url}
            alt={playlist.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-purple-accent">
            <Music size={48} className="text-white/80" />
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
      </div>

      {/* Info */}
      <h3 className="font-semibold text-sm truncate text-white group-hover:text-spotify-accent transition-colors">
        {playlist.name}
      </h3>
      <p className="text-xs text-gray-400 mt-0.5">
        {playlist.user?.username || 'You'}
      </p>
      <p className="text-[11px] text-gray-500 mt-0.5">
        {songCount} song{songCount !== 1 ? 's' : ''}
      </p>

      {playlist.description && (
        <p className="text-[11px] text-gray-500 truncate mt-1.5 line-clamp-2">
          {playlist.description}
        </p>
      )}
    </div>
  )
}

export default PlaylistCard
