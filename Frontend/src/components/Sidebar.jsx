import { useNavigate, useLocation } from 'react-router-dom'
import { Music, Home, Search, ListMusic, Heart, LogOut, Menu, X, Library } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { useState } from 'react'

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()
  const [isOpen, setIsOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Library, label: 'Library', path: '/library' },
    { icon: ListMusic, label: 'Playlists', path: '/playlists' },
    { icon: Heart, label: 'Favorites', path: '/favorites' },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative left-0 top-0 h-full w-[280px] bg-spotify-darker/95 backdrop-blur-xl transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } z-40 md:z-0 flex flex-col border-r border-white/5`}
      >
        {/* Logo */}
        <div className="p-6 pb-4">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => { navigate('/'); setIsOpen(false); }}
          >
            <div className="w-10 h-10 rounded-xl bg-accent-gradient flex items-center justify-center shadow-lg shadow-spotify-accent/20 group-hover:shadow-spotify-accent/40 transition-shadow">
              <Music className="text-white" size={22} />
            </div>
            <div>
              <span className="text-lg font-display font-bold tracking-tight">Spotify</span>
              <span className="text-lg font-display font-light text-spotify-accent ml-1">Clone</span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-3">Menu</p>
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path)
                setIsOpen(false)
              }}
              className={`nav-item w-full px-4 py-3 rounded-xl flex items-center gap-3 transition-all group ${
                isActive(item.path)
                  ? 'active text-white font-semibold'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon
                size={20}
                className={`transition-colors ${
                  isActive(item.path) ? 'text-spotify-accent' : 'group-hover:text-white'
                }`}
              />
              <span className="text-sm">{item.label}</span>
              {isActive(item.path) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-spotify-accent animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        {user && (
          <div className="p-4 m-3 mb-4 rounded-2xl glass">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-accent-gradient flex items-center justify-center text-sm font-bold text-white">
                {(user.username || 'U')[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{user.username}</p>
                <p className="text-gray-500 text-xs truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2.5 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-xl flex items-center justify-center gap-2 transition-all text-gray-400 text-sm"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm md:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}

export default Sidebar
