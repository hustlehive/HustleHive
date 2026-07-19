import { useSelector } from 'react-redux'
import {
  selectCurrentUser,
  selectCurrentToken,
  selectIsAuthenticated,
} from '@/app/slices/authSlice'

const useAuth = () => {
  const user = useSelector(selectCurrentUser)
  const token = useSelector(selectCurrentToken)
  const isAuthenticated = useSelector(selectIsAuthenticated)
  const isAdmin = user?.role === 'admin'

  // Resolved ID - works whether backend returned id or _id
  const userId = user?._id?.toString() || user?.id?.toString() || null

  return { user, token, isAuthenticated, isAdmin, userId }
}

export default useAuth