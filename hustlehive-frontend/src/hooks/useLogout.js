import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { logout } from '@/app/slices/authSlice'
import { disconnectSocket } from '@/services/socket'
import { ROUTES } from '@/constants/routes'

const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const performLogout = () => {
    // 1. Disconnect socket
    disconnectSocket()

    // 2. Clear ALL TanStack Query cache - prevents stale data for next user
    queryClient.clear()

    // 3. Clear Redux state + localStorage
    dispatch(logout())

    // 4. Navigate to login
    navigate(ROUTES.LOGIN, { replace: true })
  }

  return performLogout
}

export default useLogout