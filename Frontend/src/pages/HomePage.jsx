import { useState, useEffect } from 'react'
import { songService } from '../services'
import { SongCard, LoadingSpinner, ErrorMessage, EmptyState } from '../components'
import { Music, TrendingUp, Clock, Disc3, Sparkles } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'

const GENRE_COLORS = {
  'Electronic': 'from-blue-600 to-cyan-500',
  'Pop': 'from-pink-500 to-rose-500',
  'Rock': 'from-red-600 to-orange-500',
  'Hip-Hop': 'from-yellow-600 to-amber-500',
  'Jazz': 'from-indigo-600 to-violet-500',
  'Lo-Fi': 'from-teal-600 to-emerald-500',
  'Classical': 'from-purple-600 to-fuchsia-500',
  'Acoustic': 'from-green-600 to-lime-500',
  'Cinematic': 'from-slate-600 to-zinc-500',
  'Ambient': 'from-sky-600 to-blue-400',
  'R&B': 'from-rose-600 to-pink-400',
  'Synthwave': 'from-violet-600 to-purple-400',
  'Funk': 'from-orange-500 to-yellow-400',
  'Blues': 'from-blue-700 to-indigo-500',
  'EDM': 'from-fuchsia-500 to-pink-500',
  'Tropical': 'from-emerald-500 to-teal-400',
}

export default function HomePage() {
  const [songs, setSongs] = useState([])
  const [trendingSongs, setTrendingSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user } = useAuthStore()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [songsRes, trendingRes] = await Promise.all([
          songService.getAllSongs(0, 20),
          songService.getTrendingSongs(8),
        ])
        setSongs(songsRes.data.items || [])
        setTrendingSongs(trendingRes.data || [])
      } catch (err) {
        setError(err.response?.data?.detail || 'Failed to fetch songs')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Extract unique genres
  const genres = [...new Set(songs.map(s => s.genre).filter(Boolean))]

  const handleRefresh = () => {
    window.location.reload()
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 18) return 'Good Afternoon'
    return 'Good Evening'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="text-gray-400 mt-4 text-sm animate-pulse">Loading your music...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 pb-8 space-y-10 page-enter">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 bg-hero-gradient opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-t from-spotify-darker/80 to-transparent" />
        <div className="relative z-10 px-8 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={18} className="text-spotify-accent" />
            <span className="text-sm text-spotify-accent font-medium">{getGreeting()}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-3 leading-tight">
            {user?.username ? (
              <>Welcome back, <span className="text-gradient">{user.username}</span></>
            ) : (
              <>Discover <span className="text-gradient">New Music</span></>
            )}
          </h1>
          <p className="text-gray-300 text-lg max-w-lg">
            Stream millions of songs. Create playlists. Discover your next favorite track.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Disc3 size={16} className="text-spotify-accent" />
              <span className="text-sm">{songs.length} Tracks</span>
            </div>
            <div className="flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Music size={16} className="text-purple-400" />
              <span className="text-sm">{genres.length} Genres</span>
            </div>
          </div>
        </div>
      </section>

      {error && <ErrorMessage message={error} onRetry={handleRefresh} />}

      {/* Genre Browser */}
      {genres.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <Music size={22} className="text-spotify-accent" />
            <h2 className="text-2xl font-display font-bold">Browse by Genre</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {genres.map((genre) => (
              <div
                key={genre}
                className={`px-4 py-2 rounded-full bg-gradient-to-r ${
                  GENRE_COLORS[genre] || 'from-gray-600 to-gray-500'
                } text-white text-sm font-medium cursor-pointer hover:scale-105 hover:shadow-lg transition-all`}
              >
                {genre}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Trending Songs */}
      {trendingSongs.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-5">
            <TrendingUp size={22} className="text-spotify-accent" />
            <h2 className="text-2xl font-display font-bold">Trending Now</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {trendingSongs.map((song, idx) => (
              <SongCard
                key={song.id}
                song={song}
                songs={trendingSongs}
                index={idx}
                onFavoriteChange={handleRefresh}
              />
            ))}
          </div>
        </section>
      )}

      {/* All Songs */}
      <section>
        <div className="flex items-center gap-2 mb-5">
          <Clock size={22} className="text-purple-400" />
          <h2 className="text-2xl font-display font-bold">Latest Releases</h2>
        </div>
        {songs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
            {songs.map((song, idx) => (
              <SongCard
                key={song.id}
                song={song}
                songs={songs}
                index={idx}
                onFavoriteChange={handleRefresh}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No songs available"
            description="Check back later for new music"
            icon={Music}
          />
        )}
      </section>
    </div>
  )
}
