import { useState, useEffect } from 'react'
import { playlistService } from '../services'
import { PlaylistCard, LoadingSpinner, ErrorMessage, EmptyState } from '../components'
import { Plus, Music } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function PlaylistsPage() {
  const navigate = useNavigate()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newPlaylist, setNewPlaylist] = useState({
    name: '',
    description: '',
    is_public: false,
  })

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      setLoading(true)
      const response = await playlistService.getUserPlaylists(0, 100)
      setPlaylists(response.data.items)
      setError('')
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch playlists')
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePlaylist = async (e) => {
    e.preventDefault()
    try {
      await playlistService.createPlaylist(newPlaylist)
      setNewPlaylist({ name: '', description: '', is_public: false })
      setShowCreateModal(false)
      fetchPlaylists()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create playlist')
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">🎵 Your Playlists</h1>
          <p className="text-gray-400">
            {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-spotify-accent text-black font-semibold rounded-lg hover:bg-green-500 transition"
        >
          <Plus size={20} />
          New Playlist
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPlaylists} />}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-spotify-gray rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Playlist</h2>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylist.name}
                  onChange={(e) =>
                    setNewPlaylist((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="My Awesome Playlist"
                  required
                  className="w-full px-4 py-2 bg-spotify-dark rounded-lg border border-spotify-light-gray focus:border-spotify-accent focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description (Optional)</label>
                <textarea
                  value={newPlaylist.description}
                  onChange={(e) =>
                    setNewPlaylist((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Add a description..."
                  className="w-full px-4 py-2 bg-spotify-dark rounded-lg border border-spotify-light-gray focus:border-spotify-accent focus:outline-none resize-none"
                  rows="3"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="public"
                  checked={newPlaylist.is_public}
                  onChange={(e) =>
                    setNewPlaylist((prev) => ({ ...prev, is_public: e.target.checked }))
                  }
                  className="rounded"
                />
                <label htmlFor="public" className="text-sm">
                  Make this playlist public
                </label>
              </div>

              <div className="flex gap-2 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-spotify-accent text-black font-semibold rounded-lg hover:bg-green-500 transition"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 bg-spotify-light-gray text-white rounded-lg hover:bg-spotify-gray transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Playlists Grid */}
      {playlists.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {playlists.map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No playlists yet"
          description="Create your first playlist to organize your favorite songs"
          icon={Music}
        />
      )}
    </div>
  )
}
