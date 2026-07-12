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

  return { user, token, isAuthenticated, isAdmin }
}

export default useAuth