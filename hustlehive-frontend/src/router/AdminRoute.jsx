import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '@/hooks/useAuth'

const AdminRoute = () => {
  const { isAdmin, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/app/dashboard" replace />
  }

  return <Outlet />
}

export default AdminRoute