import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  getAdminDashboard,
  getAdminUsers,
  getAdminUserById,
  deleteAdminUser,
  getAdminHustles,
  deleteAdminHustle,
  getAdminApplications,
  getReportedUsers,
  getReportedHustles,
  banUser,
  unbanUser,
  dismissUserReports,
  dismissHustleReports,
  deleteReportedHustle,
  restoreHustle,
  deleteReport,
} from '@/api/admin.api'

export const useAdminDashboard = () =>
  useQuery({ queryKey: ['admin', 'dashboard'], queryFn: getAdminDashboard, staleTime: 0 })

export const useAdminUsers = () =>
  useQuery({ queryKey: ['admin', 'users'], queryFn: getAdminUsers, staleTime: 0 })

export const useAdminUserById = (userId) =>
  useQuery({ queryKey: ['admin', 'users', userId], queryFn: () => getAdminUserById(userId), enabled: !!userId })

export const useAdminHustles = () =>
  useQuery({ queryKey: ['admin', 'hustles'], queryFn: getAdminHustles, staleTime: 0 })

export const useAdminApplications = () =>
  useQuery({ queryKey: ['admin', 'applications'], queryFn: getAdminApplications, staleTime: 0 })

export const useAdminReportedUsers = () =>
  useQuery({ queryKey: ['admin', 'reports', 'users'], queryFn: getReportedUsers, staleTime: 0 })

export const useAdminReportedHustles = () =>
  useQuery({ queryKey: ['admin', 'reports', 'hustles'], queryFn: getReportedHustles, staleTime: 0 })

export const useDeleteAdminUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'users'] }); toast.success('User deleted') },
    onError: (err) => toast.error(err.message),
  })
}

export const useDeleteAdminHustle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteAdminHustle,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'hustles'] }); toast.success('Hustle deleted') },
    onError: (err) => toast.error(err.message),
  })
}

export const useBanUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: banUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      qc.invalidateQueries({ queryKey: ['admin', 'reports', 'users'] })
      toast.success('User banned')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useUnbanUser = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: unbanUser,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'users'] })
      toast.success('User unbanned')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useDismissUserReports = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: dismissUserReports,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'reports', 'users'] }); toast.success('Reports dismissed') },
    onError: (err) => toast.error(err.message),
  })
}

export const useDismissHustleReports = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: dismissHustleReports,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'reports', 'hustles'] }); toast.success('Reports dismissed') },
    onError: (err) => toast.error(err.message),
  })
}

export const useDeleteReportedHustle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteReportedHustle,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'reports', 'hustles'] }); toast.success('Hustle removed') },
    onError: (err) => toast.error(err.message),
  })
}

export const useRestoreHustle = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: restoreHustle,
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin', 'reports', 'hustles'] }); toast.success('Hustle restored') },
    onError: (err) => toast.error(err.message),
  })
}

export const useDeleteReport = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'reports'] })
      toast.success('Report deleted')
    },
    onError: (err) => toast.error(err.message),
  })
}