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
    disconnectSocket()
    queryClient.clear()
    dispatch(logout())

    navigate(ROUTES.LOGIN, { replace: true })
  }

  return performLogout
}

export default useLogout