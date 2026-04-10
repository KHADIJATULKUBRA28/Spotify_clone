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
    <div className="min-h-screen bg-spotify-darker flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Music className="text-spotify-accent" size={40} />
          <h1 className="text-3xl font-bold">KannadaMusic</h1>
        </div>

        {/* Card */}
        <div className="bg-spotify-gray rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          {error && <ErrorMessage message={error} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                className="w-full px-4 py-2 bg-spotify-dark rounded-lg border border-spotify-light-gray focus:border-spotify-accent focus:outline-none"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full px-4 py-2 bg-spotify-dark rounded-lg border border-spotify-light-gray focus:border-spotify-accent focus:outline-none"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-spotify-accent text-black font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center text-gray-400 mt-4">
            Don't have an account?{' '}
            <Link to="/signup" className="text-spotify-accent hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
