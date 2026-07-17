import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/constants/queryKeys'
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  deleteAllNotifications,
} from '@/api/notifications.api'
import { useDispatch } from 'react-redux'
import { clearUnreadNotifications } from '@/app/slices/uiSlice'

export const useNotifications = () => {
  return useQuery({
    queryKey: queryKeys.notifications(),
    queryFn: getNotifications,
    staleTime: 0,
  })
}

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markNotificationRead,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(queryKeys.notifications(), (old) => {
        if (!old) return old
        return {
          ...old,
          notifications: old.notifications.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          ),
        }
      })
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  return useMutation({
    mutationFn: markAllNotificationsRead,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.notifications(), (old) => {
        if (!old) return old
        return {
          ...old,
          notifications: old.notifications.map((n) => ({ ...n, isRead: true })),
        }
      })
      dispatch(clearUnreadNotifications())
      toast.success('All notifications marked as read')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useDeleteNotification = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, notificationId) => {
      queryClient.setQueryData(queryKeys.notifications(), (old) => {
        if (!old) return old
        return {
          ...old,
          notifications: old.notifications.filter((n) => n._id !== notificationId),
          count: Math.max(0, (old.count || 1) - 1),
        }
      })
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useDeleteAllNotifications = () => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch()
  return useMutation({
    mutationFn: deleteAllNotifications,
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.notifications(), () => ({
        notifications: [],
        count: 0,
      }))
      dispatch(clearUnreadNotifications())
      toast.success('All notifications cleared')
    },
    onError: (err) => toast.error(err.message),
  })
}