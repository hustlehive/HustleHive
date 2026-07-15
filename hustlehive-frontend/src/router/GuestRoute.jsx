import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectIsAuthenticated } from '@/app/slices/authSlice'

const GuestRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}

export default GuestRoute