import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.items = action.payload
    },
    toggleWishlist: (state, action) => {
      const idx = state.items.findIndex(i => i.variationId === action.payload.variationId)
      if (idx >= 0) {
        state.items.splice(idx, 1)
      } else {
        state.items.push(action.payload)
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(i => i.variationId !== action.payload)
    },
    clearWishlist: (state) => {
      state.items = []
    },
  },
})

export const { setWishlist, toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions
export const selectWishlist      = (state) => state.wishlist.items
export const selectWishlistCount = (state) => state.wishlist.items.length
export const selectIsWishlisted  = (variationId) => (state) =>
  state.wishlist.items.some(i => i.variationId === variationId)
export default wishlistSlice.reducer
