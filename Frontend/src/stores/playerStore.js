import { create } from 'zustand'

export const usePlayerStore = create((set) => ({
  currentSong: null,
  playlist: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 100,
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
      lastPlayedSongs: [song, ...state.lastPlayedSongs].slice(0, 50),
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
      let nextIndex = state.currentIndex + 1

      if (state.repeat === 'one') {
        return state
      }

      if (nextIndex >= state.playlist.length) {
        if (state.repeat === 'all') {
          nextIndex = 0
        } else {
          return { isPlaying: false }
        }
      }

      return {
        currentIndex: nextIndex,
        currentSong: state.playlist[nextIndex],
        currentTime: 0,
      }
    })
  },

  playPrevious: () => {
    set((state) => {
      let prevIndex = state.currentIndex - 1

      if (prevIndex < 0) {
        prevIndex = state.playlist.length - 1
      }

      return {
        currentIndex: prevIndex,
        currentSong: state.playlist[prevIndex],
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
        const newIndex = shuffled.findIndex((s) => s.id === currentSong.id)
        return {
          shuffle: newShuffle,
          queue: shuffled,
          currentIndex: newIndex,
        }
      } else {
        // Return to original order
        return {
          shuffle: newShuffle,
          queue: state.playlist,
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
