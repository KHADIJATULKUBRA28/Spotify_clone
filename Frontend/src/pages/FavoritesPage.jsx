import { useState, useEffect } from 'react'
import { favoriteService } from '../services'
import { SongCard, LoadingSpinner, ErrorMessage, EmptyState } from '../components'
import { Heart } from 'lucide-react'

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFavorites()
  }, [])

  const fetchFavorites = async () => {
    try {
      setLoading(true)
      const response = await favoriteService.getFavorites(0, 100)
      setFavorites(response.data.songs || [])
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch favorites')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6 page-enter">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
            <Heart size={20} className="text-white" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Liked Songs</h1>
            <p className="text-sm text-gray-400">
              {favorites.length} song{favorites.length !== 1 ? 's' : ''} in your collection
            </p>
          </div>
        </div>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchFavorites} />}

      {favorites.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {favorites.map((song, idx) => (
            <SongCard
              key={song.id}
              song={song}
              songs={favorites}
              index={idx}
              onFavoriteChange={fetchFavorites}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No liked songs yet"
          description="Heart your favorite songs and they'll appear here"
          icon={Heart}
        />
      )}
    </div>
  )
}
