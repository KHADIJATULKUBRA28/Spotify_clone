import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Music } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services'
import { ErrorMessage, LoadingSpinner } from '../components'

export default function LoginPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await authService.login(formData)
      const { access_token, user } = response.data
      setAuth(user, access_token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-spotify-darker flex flex-col items-center justify-center p-4 relative overflow-hidden animated-bg">
      {/* Background decorative elements */}
      <div className="absolute top-1/4 -left-20 w-72 h-72 bg-spotify-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10 animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="w-12 h-12 rounded-2xl bg-accent-gradient flex items-center justify-center shadow-lg shadow-spotify-accent/30">
            <Music className="text-white" size={26} />
          </div>
          <div>
            <span className="text-2xl font-display font-bold">Spotify</span>
            <span className="text-2xl font-display font-light text-spotify-accent ml-1">Clone</span>
          </div>
        </div>

        {/* Card */}
        <div className="glass-strong rounded-2xl p-8">
          <h2 className="text-2xl font-display font-bold mb-1">Welcome back</h2>
          <p className="text-sm text-gray-400 mb-6">Sign in to continue listening</p>

          {error && <div className="mb-4"><ErrorMessage message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:ring-1 focus:ring-spotify-accent/50 focus:outline-none placeholder-gray-500 transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:ring-1 focus:ring-spotify-accent/50 focus:outline-none placeholder-gray-500 transition"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-spotify-accent text-black font-bold rounded-xl hover:bg-spotify-accent-light disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-spotify-accent/20 flex items-center justify-center gap-2 text-sm btn-glow"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Sign up link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-spotify-accent hover:text-spotify-accent-light font-medium transition">
              Sign up free
            </Link>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-6">
          Built with ♥ • Spotify Clone
        </p>
      </div>
    </div>
  )
}
