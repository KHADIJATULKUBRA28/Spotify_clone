import { create } from 'zustand'

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoading: false,
  error: null,

  setAuth: (user, token) => {
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('access_token', token)
    set({ user, token, error: null })
  },

  logout: () => {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    set({ user: null, token: null })
  },

  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  initializeAuth: () => {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('access_token')
    if (user && token) {
      set({ user: JSON.parse(user), token })
    }
  },
}))
