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
    <div className="min-h-screen bg-spotify-darker flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Music className="text-spotify-accent" size={40} />
          <h1 className="text-3xl font-bold">KannadaMusic</h1>
        </div>

        {/* Card */}
        <div className="bg-spotify-gray rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6">Sign Up</h2>

          {errors.general && <ErrorMessage message={errors.general} />}

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
                className="w-full px-4 py-2 bg-spotify-dark rounded-lg border border-spotify-light-gray focus:border-spotify-accent focus:outline-none"
              />
              {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Username */}
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="username"
                className="w-full px-4 py-2 bg-spotify-dark rounded-lg border border-spotify-light-gray focus:border-spotify-accent focus:outline-none"
              />
              {errors.username && (
                <p className="text-red-400 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Full Name (Optional)</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Your Full Name"
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
                className="w-full px-4 py-2 bg-spotify-dark rounded-lg border border-spotify-light-gray focus:border-spotify-accent focus:outline-none"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 bg-spotify-dark rounded-lg border border-spotify-light-gray focus:border-spotify-accent focus:outline-none"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-spotify-accent text-black font-semibold rounded-lg hover:bg-green-500 disabled:opacity-50 transition flex items-center justify-center gap-2"
            >
              {loading && <LoadingSpinner size="sm" />}
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Login link */}
          <p className="text-center text-gray-400 mt-4">
            Already have an account?{' '}
            <Link to="/login" className="text-spotify-accent hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
