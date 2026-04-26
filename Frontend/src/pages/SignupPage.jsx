import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Music } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services'
import { ErrorMessage, LoadingSpinner } from '../components'

export default function SignupPage() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    full_name: '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email) newErrors.email = 'Email is required'
    if (!formData.username) newErrors.username = 'Username is required'
    else if (formData.username.length < 3)
      newErrors.username = 'Username must be at least 3 characters'

    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters'

    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'

    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await authService.signup({
        email: formData.email,
        username: formData.username,
        password: formData.password,
        full_name: formData.full_name,
      })
      const { access_token, user } = response.data
      setAuth(user, access_token)
      navigate('/')
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        general: err.response?.data?.detail || 'Signup failed. Please try again.',
      }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-spotify-darker flex flex-col items-center justify-center p-4 relative overflow-hidden animated-bg">
      {/* Background decorative elements */}
      <div className="absolute top-1/3 -right-20 w-72 h-72 bg-spotify-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 -left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl" />

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
          <h2 className="text-2xl font-display font-bold mb-1">Create account</h2>
          <p className="text-sm text-gray-400 mb-6">Sign up to start listening</p>

          {errors.general && <div className="mb-4"><ErrorMessage message={errors.general} /></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:ring-1 focus:ring-spotify-accent/50 focus:outline-none placeholder-gray-500 transition"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:ring-1 focus:ring-spotify-accent/50 focus:outline-none placeholder-gray-500 transition"
              />
              {errors.username && (
                <p className="text-red-400 text-xs mt-1">{errors.username}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">
                Display name <span className="text-gray-600">(optional)</span>
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your display name"
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
                placeholder="Min. 8 characters"
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:ring-1 focus:ring-spotify-accent/50 focus:outline-none placeholder-gray-500 transition"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Confirm password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat your password"
                className="w-full px-4 py-3 glass rounded-xl text-sm focus:ring-1 focus:ring-spotify-accent/50 focus:outline-none placeholder-gray-500 transition"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-spotify-accent text-black font-bold rounded-xl hover:bg-spotify-accent-light disabled:opacity-50 transition-all hover:shadow-lg hover:shadow-spotify-accent/20 flex items-center justify-center gap-2 text-sm btn-glow mt-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-gray-500">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Login link */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-spotify-accent hover:text-spotify-accent-light font-medium transition">
              Sign in
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
