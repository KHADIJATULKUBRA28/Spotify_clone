import { useState, useEffect } from 'react'
import { playlistService } from '../services'
import { PlaylistCard, LoadingSpinner, ErrorMessage, EmptyState } from '../components'
import { Plus, Music, X, ListMusic } from 'lucide-react'

export default function PlaylistsPage() {
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [creating, setCreating] = useState(false)
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
      setPlaylists(response.data.items || [])
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
      setCreating(true)
      await playlistService.createPlaylist(newPlaylist)
      setNewPlaylist({ name: '', description: '', is_public: false })
      setShowCreateModal(false)
      fetchPlaylists()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create playlist')
    } finally {
      setCreating(false)
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-accent flex items-center justify-center">
            <ListMusic size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">Your Playlists</h1>
            <p className="text-sm text-gray-400">
              {playlists.length} playlist{playlists.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-spotify-accent text-black font-semibold rounded-xl hover:bg-spotify-accent-light transition-all hover:shadow-lg hover:shadow-spotify-accent/20 text-sm"
        >
          <Plus size={18} />
          New Playlist
        </button>
      </div>

      {error && <ErrorMessage message={error} onRetry={fetchPlaylists} />}

      {/* Create Playlist Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="glass-strong rounded-2xl p-6 w-full max-w-md animate-scale-in">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-display font-bold">Create Playlist</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-full hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleCreatePlaylist} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Playlist Name</label>
                <input
                  type="text"
                  value={newPlaylist.name}
                  onChange={(e) =>
                    setNewPlaylist((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="My Awesome Playlist"
                  required
                  className="w-full px-4 py-3 glass rounded-xl text-sm focus:ring-1 focus:ring-spotify-accent/50 focus:outline-none placeholder-gray-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                <textarea
                  value={newPlaylist.description}
                  onChange={(e) =>
                    setNewPlaylist((prev) => ({ ...prev, description: e.target.value }))
                  }
                  placeholder="Add a description..."
                  className="w-full px-4 py-3 glass rounded-xl text-sm focus:ring-1 focus:ring-spotify-accent/50 focus:outline-none placeholder-gray-500 resize-none"
                  rows="3"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) =>
                    setNewPlaylist((prev) => ({ ...prev, is_public: !prev.is_public }))
                  }
                  className={`w-10 h-6 rounded-full relative transition-colors ${
                    newPlaylist.is_public ? 'bg-spotify-accent' : 'bg-gray-600'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                      newPlaylist.is_public ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
                <label className="text-sm text-gray-300">Make public</label>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 bg-spotify-accent text-black font-semibold rounded-xl hover:bg-spotify-accent-light disabled:opacity-50 transition text-sm"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2.5 glass rounded-xl hover:bg-white/10 transition text-sm"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
