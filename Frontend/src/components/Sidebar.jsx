import { useNavigate } from 'react-router-dom'
import { Music, Home, Search, ListMusic, Heart, LogOut, Menu, X } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useState } from 'react'

const Sidebar = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: ListMusic, label: 'Library', path: '/library' },
    { icon: Music, label: 'Playlists', path: '/playlists' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 hover:bg-spotify-gray rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative left-0 top-0 h-full w-64 bg-spotify-darker transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } z-40 md:z-0 flex flex-col border-r border-spotify-gray`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-spotify-gray">
          <div className="flex items-center gap-2">
            <Music className="text-spotify-accent" size={32} />
            <span className="text-xl font-bold">KannadaMusic</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path)
                setIsOpen(false)
              }}
              className="w-full px-4 py-3 rounded-lg hover:bg-spotify-gray flex items-center gap-3 transition-colors"
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="border-t border-spotify-gray p-4 space-y-3">
            <div className="text-sm truncate">
              <p className="font-semibold">{user.username}</p>
              <p className="text-gray-400 text-xs">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center gap-2 transition"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
