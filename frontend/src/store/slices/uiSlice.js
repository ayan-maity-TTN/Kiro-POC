import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    sidebarOpen: false,
    mobileMenuOpen: false,
    searchOpen: false,
  },
  reducers: {
    toggleSidebar:    (state) => { state.sidebarOpen = !state.sidebarOpen },
    setSidebarOpen:   (state, action) => { state.sidebarOpen = action.payload },
    toggleMobileMenu: (state) => { state.mobileMenuOpen = !state.mobileMenuOpen },
    setMobileMenu:    (state, action) => { state.mobileMenuOpen = action.payload },
    toggleSearch:     (state) => { state.searchOpen = !state.searchOpen },
    setSearchOpen:    (state, action) => { state.searchOpen = action.payload },
  },
})

export const {
  toggleSidebar, setSidebarOpen,
  toggleMobileMenu, setMobileMenu,
  toggleSearch, setSearchOpen,
} = uiSlice.actions
export const selectSidebarOpen   = (state) => state.ui.sidebarOpen
export const selectMobileMenu    = (state) => state.ui.mobileMenuOpen
export const selectSearchOpen    = (state) => state.ui.searchOpen
export default uiSlice.reducer
