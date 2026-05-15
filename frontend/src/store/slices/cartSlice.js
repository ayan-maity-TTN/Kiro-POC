import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload
      state.totalItems = action.payload.length
      state.totalPrice = action.payload.reduce((sum, item) => {
        return sum + (item.price || 0) * (item.quantity || 1)
      }, 0)
    },
    addToCart: (state, action) => {
      const existing = state.items.find(i => i.variationId === action.payload.variationId)
      if (existing) {
        existing.quantity = (existing.quantity || 1) + 1
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
      }
      state.totalItems = state.items.length
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    },
    decrementItem: (state, action) => {
      const item = state.items.find(i => i.variationId === action.payload)
      if (item) {
        if (item.quantity > 1) {
          item.quantity -= 1
        } else {
          state.items = state.items.filter(i => i.variationId !== action.payload)
        }
      }
      state.totalItems = state.items.length
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i.variationId !== action.payload)
      state.totalItems = state.items.length
      state.totalPrice = state.items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
    },
    clearCart: (state) => {
      state.items = []
      state.totalItems = 0
      state.totalPrice = 0
    },
  },
})

export const { setCart, addToCart, decrementItem, removeFromCart, clearCart } = cartSlice.actions
export const selectCart       = (state) => state.cart
export const selectCartItems  = (state) => state.cart.items
export const selectCartCount  = (state) => state.cart.totalItems
export const selectCartTotal  = (state) => state.cart.totalPrice
export default cartSlice.reducer
