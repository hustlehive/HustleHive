import { useMutation } from '@tanstack/react-query'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { setCredentials } from '@/app/slices/authSlice'
import {
  sendOtp,
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} from '@/api/auth.api'
import { ROUTES } from '@/constants/routes'
import { initSocket, emitRegister } from '@/services/socket'

export const useSendOtp = () => {
  return useMutation({
    mutationFn: sendOtp,
    onError: (err) => toast.error(err.message),
  })
}

export const useRegister = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }))
      const socket = initSocket(data.token)
      socket.on('connect', () => emitRegister(data.user.id))
      toast.success(`Welcome to HustleHive, ${data.user.fullName.split(' ')[0]}!`)
      navigate(ROUTES.DASHBOARD, { replace: true })
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      dispatch(setCredentials({ user: data.user, token: data.token }))
      const socket = initSocket(data.token)
      socket.on('connect', () => emitRegister(data.user.id))
      toast.success(`Welcome back, ${data.user.fullName.split(' ')[0]}!`)
      navigate(ROUTES.DASHBOARD, { replace: true })
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useForgotPassword = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (_, variables) => {
      toast.success('OTP sent to your email')
      navigate(ROUTES.FORGOT_PASSWORD_VERIFY, {
        state: { email: variables.email },
      })
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useResetPassword = () => {
  const navigate = useNavigate()

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: () => {
      toast.success('Password reset successfully. Please login.')
      navigate(ROUTES.LOGIN, { replace: true })
    },
    onError: (err) => toast.error(err.message),
  })
}