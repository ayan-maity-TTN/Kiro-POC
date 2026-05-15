import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated, selectRole } from '../store/slices/authSlice'

export default function ProtectedRoute({ allowedRoles = [] }) {
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const role            = useSelector(selectRole)
  const location        = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
    // Redirect to their own dashboard
    if (role === 'ADMIN')    return <Navigate to="/admin/dashboard" replace />
    if (role === 'SELLER')   return <Navigate to="/seller/dashboard" replace />
    if (role === 'CUSTOMER') return <Navigate to="/customer/dashboard" replace />
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
