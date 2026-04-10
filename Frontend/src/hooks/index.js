import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { userService } from '../services'

export const useAuth = () => {
  const { user, token, setAuth, logout, initializeAuth } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  const isAuthenticated = !!token && !!user

  return {
    user,
    token,
    isAuthenticated,
    setAuth,
    logout,
  }
}

export const useRequireAuth = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [isAuthenticated, navigate])

  return isAuthenticated
}

export const useFetch = (fetchFn, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const result = await fetchFn()
        setData(result.data)
        setError(null)
      } catch (err) {
        setError(err.response?.data?.detail || err.message)
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, dependencies)

  return { data, loading, error, refetch: () => fetchFn() }
}

export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(error)
      return initialValue
    }
  })

  const setStoredValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(value) : value
      setValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.error(error)
    }
  }

  return [value, setStoredValue]
}

export const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => clearTimeout(handler)
  }, [value, delay])

  return debouncedValue
}
