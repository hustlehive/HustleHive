import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/constants/queryKeys'
import {
  getFriends,
  getReceivedRequests,
  getSentRequests,
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  unfriend,
  searchUsers,
} from '@/api/users.api'

export const useFriends = () => {
  return useQuery({
    queryKey: queryKeys.friends(),
    queryFn: getFriends,
    staleTime: 60_000,
  })
}

export const useReceivedRequests = () => {
  return useQuery({
    queryKey: queryKeys.requestsReceived(),
    queryFn: getReceivedRequests,
  })
}

export const useSentRequests = () => {
  return useQuery({
    queryKey: queryKeys.requestsSent(),
    queryFn: getSentRequests,
  })
}

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sendFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestsSent() })
      queryClient.invalidateQueries({ queryKey: ['users', 'search'] })
      toast.success('Friend request sent!')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestsReceived() })
      queryClient.invalidateQueries({ queryKey: queryKeys.friends() })
      toast.success('Friend request accepted!')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestsReceived() })
      toast.success('Friend request rejected')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useCancelFriendRequest = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requestsSent() })
      queryClient.invalidateQueries({ queryKey: ['users', 'search'] })
      toast.success('Friend request cancelled')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useUnfriend = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: unfriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.friends() })
      queryClient.invalidateQueries({ queryKey: ['users', 'search'] })
      toast.success('Unfriended successfully')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useUserSearch = (username) => {
  return useQuery({
    queryKey: queryKeys.userSearch(username),
    queryFn: () => searchUsers(username),
    enabled: !!username && username.trim().length > 0,
    staleTime: 15_000,
  })
}