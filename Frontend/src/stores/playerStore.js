import { create } from 'zustand'

export const usePlayerStore = create((set, get) => ({
  currentSong: null,
  playlist: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  repeat: 'off', // 'off', 'one', 'all'
  shuffle: false,
  currentIndex: 0,
  queue: [],
  lastPlayedSongs: [],

  setCurrentSong: (song, index = 0) => {
    set((state) => ({
      currentSong: song,
      currentIndex: index,
      currentTime: 0,
      lastPlayedSongs: [song, ...state.lastPlayedSongs.filter(s => s.id !== song.id)].slice(0, 50),
    }))
  },

  setPlaylist: (playlist) => {
    set({
      playlist,
      queue: playlist,
    })
  },

  setIsPlaying: (isPlaying) => set({ isPlaying }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume: Math.max(0, Math.min(100, volume)) }),

  setRepeat: (repeat) => set({ repeat }),

  setShuffle: (shuffle) => set({ shuffle }),

  playNext: () => {
    set((state) => {
      const list = state.shuffle ? state.queue : state.playlist
      if (!list.length) return { isPlaying: false }

      if (state.repeat === 'one') {
        // For repeat one, we still need to trigger a re-render
        return { currentTime: 0 }
      }

      let nextIndex

      if (state.shuffle) {
        // Pick a random song that's not the current one
        if (list.length <= 1) {
          nextIndex = 0
        } else {
          do {
            nextIndex = Math.floor(Math.random() * list.length)
          } while (nextIndex === state.currentIndex && list.length > 1)
        }
      } else {
        nextIndex = state.currentIndex + 1
      }

      if (nextIndex >= list.length) {
        if (state.repeat === 'all') {
          nextIndex = 0
        } else {
          return { isPlaying: false }
        }
      }

      return {
        currentIndex: nextIndex,
        currentSong: list[nextIndex],
        currentTime: 0,
      }
    })
  },

  playPrevious: () => {
    set((state) => {
      const list = state.shuffle ? state.queue : state.playlist
      if (!list.length) return state

      // If more than 3 seconds in, restart current song
      if (state.currentTime > 3) {
        return { currentTime: 0 }
      }

      let prevIndex = state.currentIndex - 1
      if (prevIndex < 0) {
        prevIndex = list.length - 1
      }

      return {
        currentIndex: prevIndex,
        currentSong: list[prevIndex],
        currentTime: 0,
      }
    })
  },

  toggleShuffle: () => {
    set((state) => {
      const newShuffle = !state.shuffle
      if (newShuffle) {
        // Shuffle the queue
        const shuffled = [...state.playlist].sort(() => Math.random() - 0.5)
        const currentSong = state.currentSong
        const newIndex = shuffled.findIndex((s) => s.id === currentSong?.id)
        return {
          shuffle: newShuffle,
          queue: shuffled,
          currentIndex: newIndex >= 0 ? newIndex : 0,
        }
      } else {
        // Return to original order
        const currentSong = state.currentSong
        const newIndex = state.playlist.findIndex((s) => s.id === currentSong?.id)
        return {
          shuffle: newShuffle,
          queue: state.playlist,
          currentIndex: newIndex >= 0 ? newIndex : 0,
        }
      }
    })
  },

  clear: () => {
    set({
      currentSong: null,
      playlist: [],
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentIndex: 0,
      queue: [],
    })
  },
}))
