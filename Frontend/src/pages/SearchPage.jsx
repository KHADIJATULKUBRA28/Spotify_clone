import { useState, useEffect } from 'react'
import { songService } from '../services'
import { SongCard, LoadingSpinner, ErrorMessage, EmptyState, PaginationControls } from '../components'
import { Search, TrendingUp } from 'lucide-react'
import { useDebouncedValue } from '../hooks'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const debouncedQuery = useDebouncedValue(query, 500)

  const itemsPerPage = 20
  const totalPages = Math.ceil(total / itemsPerPage)
  const skip = (page - 1) * itemsPerPage

  const handleSearch = async (searchQuery, searchSkip) => {
    if (!searchQuery?.trim()) {
      setSongs([])
      setHasSearched(false)
      return
    }

    try {
      setLoading(true)
      const response = await songService.searchSongs(searchQuery, searchSkip ?? skip, itemsPerPage)
      setSongs(response.data.items || [])
      setTotal(response.data.total || 0)
      setHasSearched(true)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    setPage(1)
    handleSearch(query, 0)
  }

  // Debounced search
  useEffect(() => {
    if (debouncedQuery) {
      setPage(1)
      handleSearch(debouncedQuery, 0)
    } else {
      setSongs([])
      setHasSearched(false)
    }
  }, [debouncedQuery])

  // Search when page changes
  useEffect(() => {
    if (hasSearched && query) {
      handleSearch(query)
    }
  }, [page])

  return (
    <div className="p-6 page-enter">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold mb-6">
          <span className="text-gradient">Search</span> Music
        </h1>
        <form onSubmit={handleSearchSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What do you want to listen to?"
              className="w-full px-4 py-3.5 pl-11 glass rounded-xl text-sm focus:ring-1 focus:ring-spotify-accent/50 focus:outline-none placeholder-gray-500 transition"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-spotify-accent text-black font-semibold rounded-xl hover:bg-spotify-accent-light transition-all hover:shadow-lg hover:shadow-spotify-accent/20 text-sm"
          >
            Search
          </button>
        </form>
      </div>

      {error && <ErrorMessage message={error} onRetry={() => handleSearch(query)} />}

      {loading && (
        <div className="flex justify-center py-12">
          <LoadingSpinner />
        </div>
      )}

      {hasSearched && !loading && (
        <>
          {songs.length > 0 ? (
            <>
              <div className="mb-5 flex items-center gap-2">
                <TrendingUp size={16} className="text-spotify-accent" />
                <p className="text-sm text-gray-400">
                  Found <span className="text-white font-medium">{total}</span> result{total !== 1 ? 's' : ''} for "<span className="text-spotify-accent">{query}</span>"
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                {songs.map((song, idx) => (
                  <SongCard key={song.id} song={song} songs={songs} index={idx} />
                ))}
              </div>

              {totalPages > 1 && (
                <PaginationControls
                  page={page}
                  totalPages={totalPages}
                  onPrevious={() => setPage((p) => Math.max(1, p - 1))}
                  onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                />
              )}
            </>
          ) : (
            <EmptyState
              title="No results found"
              description={`No songs found matching "${query}". Try a different search.`}
              icon={Search}
            />
          )}
        </>
      )}

      {!hasSearched && !query && (
        <EmptyState
          title="Search for music"
          description="Find your favorite songs, artists, and albums"
          icon={Search}
        />
      )}
    </div>
  )
}
