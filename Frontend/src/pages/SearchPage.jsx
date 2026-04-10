import { useState } from 'react'
import { songService } from '../services'
import { SongCard, LoadingSpinner, ErrorMessage, EmptyState, PaginationControls } from '../components'
import { Search } from 'lucide-react'
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

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      setSongs([])
      setHasSearched(false)
      return
    }

    try {
      setLoading(true)
      const response = await songService.searchSongs(debouncedQuery, skip, itemsPerPage)
      setSongs(response.data.items)
      setTotal(response.data.total)
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
    handleSearch()
  }

  // Effect to handle debounced search
  React.useEffect(() => {
    if (debouncedQuery) {
      setPage(1)
      handleSearch()
    }
  }, [debouncedQuery])

  return (
    <div className="p-6">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-6">Search Songs</h1>
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, artist, or album..."
              className="w-full px-4 py-3 pl-10 bg-spotify-gray rounded-lg border border-spotify-light-gray focus:border-spotify-accent focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 bg-spotify-accent text-black font-semibold rounded-lg hover:bg-green-500 transition"
          >
            Search
          </button>
        </form>
      </div>

      {error && <ErrorMessage message={error} onRetry={handleSearch} />}

      {loading && (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      )}

      {hasSearched && !loading && (
        <>
          {songs.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-gray-400">
                  Found {total} result{total !== 1 ? 's' : ''} for "{query}"
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-8">
                {songs.map((song) => (
                  <SongCard key={song.id} song={song} />
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
              description={`No songs found matching "${query}"`}
              icon={Search}
            />
          )}
        </>
      )}

      {!hasSearched && !query && (
        <EmptyState
          title="Start searching"
          description="Enter a song title, artist name, or album to find your favorite Kannada music"
          icon={Search}
        />
      )}
    </div>
  )
}
