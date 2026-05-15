import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { selectAuth, selectUser, selectRole, selectIsAuthenticated, setCredentials, logout as logoutAction } from '../store/slices/authSlice'
import { clearCart } from '../store/slices/cartSlice'
import { clearWishlist } from '../store/slices/wishlistSlice'
import authService from '../services/authService'
import { ROLES } from '../constants'

export function useAuth() {
  const dispatch   = useDispatch()
  const navigate   = useNavigate()
  const auth       = useSelector(selectAuth)
  const user       = useSelector(selectUser)
  const role       = useSelector(selectRole)
  const isAuth     = useSelector(selectIsAuthenticated)

  const login = async (email, password) => {
    const res = await authService.login(email, password)
    // Backend returns user info in message; we need to fetch profile separately
    // For now store minimal info; profile fetch happens in layout
    return res.data
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (_) {
      // ignore
    } finally {
      dispatch(logoutAction())
      dispatch(clearCart())
      dispatch(clearWishlist())
      toast.success('Logged out successfully')
      navigate('/login')
    }
  }

  const isAdmin    = role === ROLES.ADMIN
  const isSeller   = role === ROLES.SELLER
  const isCustomer = role === ROLES.CUSTOMER

  return { user, role, isAuth, isAdmin, isSeller, isCustomer, login, logout }
}
