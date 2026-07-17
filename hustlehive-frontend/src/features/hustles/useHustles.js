import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { queryKeys } from '@/constants/queryKeys'
import {
  getHustles,
  getHustleById,
  createHustle,
  updateHustle,
  deleteHustle,
  applyToHustle,
  getApplicants,
  acceptApplication,
  rejectApplication,
  getMyApplications,
} from '@/api/hustles.api'

export const useHustlesList = (filters) => {
  return useQuery({
    queryKey: queryKeys.hustles(filters),
    queryFn: () => getHustles(filters),
    staleTime: 30_000,
  })
}

export const useHustleById = (id) => {
  return useQuery({
    queryKey: queryKeys.hustle(id),
    queryFn: () => getHustleById(id),
    enabled: !!id,
  })
}

export const useCreateHustle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createHustle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hustles'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Hustle created successfully!')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useUpdateHustle = (id) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data) => updateHustle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.hustle(id) })
      queryClient.invalidateQueries({ queryKey: ['hustles'] })
      toast.success('Hustle updated!')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useDeleteHustle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteHustle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['hustles'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('Hustle deleted')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useApplyToHustle = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: applyToHustle,
    onSuccess: () => {
      // Invalidate my-applications so alreadyApplied check updates instantly
      queryClient.invalidateQueries({ queryKey: queryKeys.myApplications() })
      toast.success('Applied successfully!')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useApplicants = (hustleId) => {
  return useQuery({
    queryKey: queryKeys.applicants(hustleId),
    queryFn: () => getApplicants(hustleId),
    enabled: !!hustleId,
  })
}

export const useAcceptApplication = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: acceptApplication,
    onSuccess: (_, applicationId) => {
      // Invalidate all hustle and applicant queries
      queryClient.invalidateQueries({ queryKey: ['hustles'] })
      queryClient.invalidateQueries({ queryKey: ['hustle'] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Applicant accepted!')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useRejectApplication = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: rejectApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      toast.success('Application rejected')
    },
    onError: (err) => toast.error(err.message),
  })
}

export const useMyApplications = () => {
  return useQuery({
    queryKey: queryKeys.myApplications(),
    queryFn: getMyApplications,
  })
}