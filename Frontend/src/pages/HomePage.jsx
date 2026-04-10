import { useState, useEffect } from 'react'
import { songService } from '../services'
import { SongCard, LoadingSpinner, ErrorMessage, EmptyState } from '../components'
import { Music } from 'lucide-react'

export default function HomePage() {
  const [songs, setSongs] = useState([])
  const [trendingSongs, setTrendingSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [songsRes, trendingRes] = await Promise.all([
          songService.getAllSongs(0, 12),
          songService.getTrendingSongs(6),
        ])
        setSongs(songsRes.data.items)
        setTrendingSongs(trendingRes.data)
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch songs')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleRefresh = async () => {
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-spotify-accent to-purple-600 rounded-lg p-12 text-white">
        <h1 className="text-5xl font-bold mb-2">Welcome to KannadaMusic</h1>
        <p className="text-xl opacity-90">Explore the best Kannada songs</p>
      </section>

      {error && <ErrorMessage message={error} onRetry={handleRefresh} />}

      {/* Trending Songs */}
      {trendingSongs.length > 0 && (
        <section>
          <h2 className="text-3xl font-bold mb-6">🔥 Trending Now</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {trendingSongs.map((song) => (
              <SongCard key={song.id} song={song} onFavoriteChange={handleRefresh} />
            ))}
          </div>
        </section>
      )}

      {/* All Songs */}
      <section>
        <h2 className="text-3xl font-bold mb-6">Latest Songs</h2>
        {songs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {songs.map((song) => (
              <SongCard key={song.id} song={song} onFavoriteChange={handleRefresh} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No songs available"
            description="Start by uploading some Kannada songs"
            icon={Music}
          />
        )}
      </section>
    </div>
  )
}
