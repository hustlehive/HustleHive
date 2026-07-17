import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/constants/queryKeys'
import {
  getInbox,
  getConversationMessages,
  sendMessage,
  markConversationRead,
  editMessage,
  deleteMessage,
  startConversation,
} from '@/api/messages.api'

export const useInbox = (type) => {
  return useQuery({
    queryKey: queryKeys.inbox(type),
    queryFn: () => getInbox(type),
    staleTime: 0,
  })
}

export const useConversationMessages = (conversationId) => {
  return useQuery({
    queryKey: queryKeys.conversation(conversationId),
    queryFn: () => getConversationMessages(conversationId),
    enabled: !!conversationId,
    staleTime: 0,
  })
}

export const useSendMessage = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sendMessage,
    onSuccess: (data) => {
      const convId = data?.message?.conversation?.toString() || data?.message?.conversationId?.toString()
      if (convId) {
        // Append message to conversation cache
        queryClient.setQueryData(queryKeys.conversation(convId), (old) => {
          if (!old) return old
          const exists = old.messages?.some((m) => m._id === data.message._id)
          if (exists) return old
          return { ...old, messages: [...(old.messages || []), data.message] }
        })
        // Refresh inbox
        queryClient.invalidateQueries({ queryKey: ['messages', 'inbox'] })
      }
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useMarkConversationRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markConversationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', 'inbox'] })
    },
  })
}

export const useEditMessage = (conversationId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ messageId, content }) => editMessage(messageId, content),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeys.conversation(conversationId), (old) => {
        if (!old) return old
        return {
          ...old,
          messages: old.messages.map((m) =>
            m._id === data.message._id ? { ...m, ...data.message } : m
          ),
        }
      })
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useDeleteMessage = (conversationId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMessage,
    onSuccess: (_, messageId) => {
      queryClient.setQueryData(queryKeys.conversation(conversationId), (old) => {
        if (!old) return old
        return {
          ...old,
          messages: old.messages.map((m) =>
            m._id === messageId
              ? { ...m, deletedForEveryone: true, content: 'This message was deleted.' }
              : m
          ),
        }
      })
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useStartConversation = () => {
  return useMutation({
    mutationFn: startConversation,
    onError: (err) => toast.error(err.message),
  })
}