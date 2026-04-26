import { Music, AlertCircle, Inbox } from 'lucide-react'

export const LoadingSpinner = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  }

  return (
    <div className="flex items-center justify-center">
      <div className={`${sizes[size]} relative`}>
        <div className="absolute inset-0 rounded-full border-2 border-spotify-accent/20" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-spotify-accent animate-spin" />
        <div className="absolute inset-1 rounded-full border-2 border-transparent border-t-purple-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
    </div>
  )
}

export const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="glass rounded-xl p-4 border border-red-500/20 animate-fade-in">
      <div className="flex items-start gap-3">
        <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm text-red-300">{message || 'An error occurred'}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-xs px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export const EmptyState = ({ title, description, icon: Icon }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-5">
        {Icon ? (
          <Icon size={36} className="text-gray-500" />
        ) : (
          <Inbox size={36} className="text-gray-500" />
        )}
      </div>
      <h3 className="text-xl font-display font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm">{description}</p>
    </div>
  )
}

export const PaginationControls = ({ page, totalPages, onPrevious, onNext }) => {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <button
        onClick={onPrevious}
        disabled={page <= 1}
        className="px-5 py-2 glass rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition"
      >
        Previous
      </button>
      <span className="text-sm text-gray-400 px-3">
        {page} / {totalPages}
      </span>
      <button
        onClick={onNext}
        disabled={page >= totalPages}
        className="px-5 py-2 glass rounded-xl text-sm font-medium disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition"
      >
        Next
      </button>
    </div>
  )
}

export const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'glass text-white',
    accent: 'bg-spotify-accent/20 text-spotify-accent border border-spotify-accent/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
  }

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
