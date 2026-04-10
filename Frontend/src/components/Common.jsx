import { Music } from 'lucide-react'

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} animate-spin`}>
        <Music className="text-spotify-accent" size="100%" />
      </div>
    </div>
  )
}

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-300">
      <p className="mb-2">{message || 'An error occurred'}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-sm px-3 py-1 bg-red-700 hover:bg-red-600 rounded transition"
        >
          Retry
        </button>
      )}
    </div>
  )
}

export const EmptyState = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {Icon && <Icon size={48} className="text-gray-500 mb-4" />}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}

export const PaginationControls = ({ page, totalPages, onPrevious, onNext }) => {
  return (
    <div className="flex items-center justify-center gap-4 py-4">
      <button
        onClick={onPrevious}
        disabled={page <= 1}
        className="px-4 py-2 bg-spotify-accent text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition"
      >
        Previous
      </button>
      <span className="text-sm text-gray-400">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-4 py-2 bg-spotify-accent text-black rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-500 transition"
      >
        Next
      </button>
    </div>
  )
}

export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-spotify-gray text-white',
    accent: 'bg-spotify-accent text-black',
    success: 'bg-green-600 text-white',
    error: 'bg-red-600 text-white',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
