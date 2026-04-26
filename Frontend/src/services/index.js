import apiClient from './api'

export const authService = {
  signup: (data) => apiClient.post('/auth/signup', data),
  login: (data) => apiClient.post('/auth/login', data),
  logout: () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user')
  },
}

export const userService = {
  getCurrentUser: () => apiClient.get('/users/me'),
  getUserProfile: (userId) => apiClient.get(`/users/${userId}/profile`),
  updateProfile: (data) => apiClient.put('/users/me', data),
  getExtendedProfile: () => apiClient.get('/users/profile/me'),
}

export const songService = {
  getAllSongs: (skip = 0, limit = 20, sortBy = 'created_at', order = 'desc') =>
    apiClient.get('/songs', {
      params: { skip, limit, sort_by: sortBy, order },
    }),
  getSongById: (id) => apiClient.get(`/songs/${id}`),
  streamSong: (id) => `${import.meta.env.VITE_API_BASE_URL}/api/songs/${id}/stream`,
  searchSongs: (query, skip = 0, limit = 20) =>
    apiClient.get('/songs/search', {
      params: { q: query, skip, limit },
    }),
  getSongsByGenre: (genre, skip = 0, limit = 20) =>
    apiClient.get(`/songs/genre/${genre}`, {
      params: { skip, limit },
    }),
  getTrendingSongs: (limit = 10) =>
    apiClient.get('/songs/trending', {
      params: { limit },
    }),
  uploadAudio: (songId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`/songs/${songId}/upload-audio`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  uploadThumbnail: (songId, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return apiClient.post(`/songs/${songId}/upload-thumbnail`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}

export const playlistService = {
  getUserPlaylists: (skip = 0, limit = 20) =>
    apiClient.get('/playlists', {
      params: { skip, limit },
    }),
  getPlaylistById: (id) => apiClient.get(`/playlists/${id}`),
  createPlaylist: (data) => apiClient.post('/playlists', data),
  updatePlaylist: (id, data) => apiClient.put(`/playlists/${id}`, data),
  deletePlaylist: (id) => apiClient.delete(`/playlists/${id}`),
  addSongToPlaylist: (playlistId, songId) =>
    apiClient.post(`/playlists/${playlistId}/songs`, { song_id: songId }),
  removeSongFromPlaylist: (playlistId, songId) =>
    apiClient.delete(`/playlists/${playlistId}/songs/${songId}`),
  getPublicPlaylists: (skip = 0, limit = 20) =>
    apiClient.get('/playlists/public', {
      params: { skip, limit },
    }),
}

export const favoriteService = {
  getFavorites: (skip = 0, limit = 20) =>
    apiClient.get('/favorites', {
      params: { skip, limit },
    }),
  addFavorite: (songId) =>
    apiClient.post('/favorites', { song_id: songId }),
  removeFavorite: (songId) =>
    apiClient.delete(`/favorites/${songId}`),
  checkFavorite: (songId) =>
    apiClient.get(`/favorites/${songId}/check`),
}

export const recentlyPlayedService = {
  getRecentlyPlayed: (limit = 20) =>
    apiClient.get('/recently-played', {
      params: { limit },
    }),
  addToRecentlyPlayed: (songId) =>
    apiClient.post(`/recently-played/${songId}`),
}
