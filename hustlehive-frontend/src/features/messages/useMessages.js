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
  deleteConversationForMe,
  deleteMessageForMe,
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
      const msg = data?.message
      if (!msg) return
      const convId = (
        msg.conversation?._id ||
        msg.conversation?.id ||
        msg.conversation
      )?.toString()
      if (!convId) return
      queryClient.setQueryData(queryKeys.conversation(convId), (old) => {
        if (!old) return old
        const exists = old.messages?.some((m) => m._id === msg._id)
        if (exists) return old
        return { ...old, messages: [...(old.messages || []), msg] }
      })
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox() })
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useMarkConversationRead = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: markConversationRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox() })
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

// New: Delete conversation for me
export const useDeleteConversationForMe = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteConversationForMe,
    onSuccess: () => {
      // Refetch inbox so the conversation disappears
      queryClient.invalidateQueries({ queryKey: queryKeys.inbox() })
      toast.success('Conversation deleted')
    },
    onError: (err) => toast.error(err.message),
  })
}

// New: Delete message for me only
export const useDeleteMessageForMe = (conversationId) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteMessageForMe,
    onSuccess: (_, messageId) => {
      // Remove message from cache for this user only
      queryClient.setQueryData(queryKeys.conversation(conversationId), (old) => {
        if (!old) return old
        return {
          ...old,
          messages: old.messages.filter((m) => m._id !== messageId),
        }
      })
      toast.success('Message deleted for you')
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