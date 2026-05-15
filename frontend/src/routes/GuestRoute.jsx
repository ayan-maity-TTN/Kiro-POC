import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectRole } from '../store/slices/authSlice'

export default function GuestRoute() {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role            = useSelector(selectRole)

  if (!isAuthenticated) return <Outlet />

  if (role === 'ADMIN')    return <Navigate to="/admin/dashboard" replace />
  if (role === 'SELLER')   return <Navigate to="/seller/dashboard" replace />
  if (role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />
  return <Navigate to="/" replace />
}
