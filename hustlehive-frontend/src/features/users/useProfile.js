import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/constants/queryKeys'
import {
  getMyProfile,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  getPublicProfile,
  getUserHustles,
  getUserFriends,
} from '@/api/users.api'
import { useDispatch } from 'react-redux'
import { updateUser } from '@/app/slices/authSlice'

export const useMyProfile = () => {
  return useQuery({
    queryKey: ['profile', 'me'],
    queryFn: getMyProfile,
    staleTime: 60_000,
  })
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] })
      dispatch(updateUser(data.user))
      toast.success('Profile updated!')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  return useMutation({
    mutationFn: uploadProfilePicture,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] })
      dispatch(updateUser({ profilePic: data.profilePic }))
      toast.success('Profile picture updated!')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useDeleteProfilePicture = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  return useMutation({
    mutationFn: deleteProfilePicture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', 'me'] })
      dispatch(updateUser({ profilePic: { url: '', publicId: '' } }))
      toast.success('Profile picture removed')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const usePublicProfile = (userId) => {
  return useQuery({
    queryKey: queryKeys.publicProfile(userId),
    queryFn: () => getPublicProfile(userId),
    enabled: !!userId,
    staleTime: 60_000,
  })
}

export const useUserHustles = (userId) => {
  return useQuery({
    queryKey: queryKeys.userHustles(userId),
    queryFn: () => getUserHustles(userId),
    enabled: !!userId,
  })
}

export const useUserFriends = (userId) => {
  return useQuery({
    queryKey: queryKeys.userFriends(userId),
    queryFn: () => getUserFriends(userId),
    enabled: !!userId,
  })
}