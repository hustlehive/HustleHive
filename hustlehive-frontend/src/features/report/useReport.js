import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { reportUser, reportHustle } from '@/api/report.api'

export const useReportUser = () => {
  return useMutation({
    mutationFn: ({ userId, data }) => reportUser(userId, data),
    onSuccess: () => toast.success('User reported successfully'),
    onError: (err) => toast.error(err.message),
  })
}

export const useReportHustle = () => {
  return useMutation({
    mutationFn: ({ hustleId, data }) => reportHustle(hustleId, data),
    onSuccess: () => toast.success('Hustle reported successfully'),
    onError: (err) => toast.error(err.message),
  })
}