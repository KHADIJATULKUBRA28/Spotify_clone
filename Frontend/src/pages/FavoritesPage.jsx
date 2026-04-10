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
      setFavorites(response.data.songs)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch favorites')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">❤️ Your Favorites</h1>
        <p className="text-gray-400">{favorites.length} song{favorites.length !== 1 ? 's' : ''}</p>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchFavorites} />}

      {favorites.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {favorites.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              onFavoriteChange={fetchFavorites}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No favorites yet"
          description="Heart your favorite songs to see them here"
          icon={Heart}
        />
      )}
    </div>
  )
}
