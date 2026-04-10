import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import { Sidebar, Player } from './components'
import {
  LoginPage,
  SignupPage,
  HomePage,
  SearchPage,
  FavoritesPage,
  PlaylistsPage,
} from './pages'

function ProtectedRoute({ children }) {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" />
}

export default function App() {
  const { initializeAuth, token } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <Router>
      {token ? (
        <div className="h-screen flex flex-col bg-spotify-darker">
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/playlists" element={<PlaylistsPage />} />
                <Route path="/library" element={<HomePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </div>

          {/* Player */}
          <Player />
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      )}
    </Router>
  )
}
