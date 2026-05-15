import { configureStore } from '@reduxjs/toolkit'
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { combineReducers } from 'redux'
import authReducer from './slices/authSlice'
import cartReducer from './slices/cartSlice'
import wishlistReducer from './slices/wishlistSlice'
import themeReducer from './slices/themeSlice'
import uiReducer from './slices/uiSlice'

const rootReducer = combineReducers({
  auth:     authReducer,
  cart:     cartReducer,
  wishlist: wishlistReducer,
  theme:    themeReducer,
  ui:       uiReducer,
})

const persistConfig = {
  key: 'shopperse-root',
  version: 1,
  storage,
  whitelist: ['auth', 'cart', 'wishlist', 'theme'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
