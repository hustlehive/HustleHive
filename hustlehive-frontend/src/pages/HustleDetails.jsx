import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  MapPin,
  Clock,
  Edit,
  Trash2,
  Users,
  Zap,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Clock3,
  ZoomIn,
} from 'lucide-react'
import {
  useHustleById,
  useApplyToHustle,
  useDeleteHustle,
  useApplicants,
  useMyApplications,
} from '@/features/hustles/useHustles'
import StatusBadge from '@/components/common/StatusBadge'
import AppAvatar from '@/components/common/AppAvatar'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import ApplicantCard from '@/components/hustle/ApplicantCard'
import ImageLightbox from '@/components/common/ImageLightbox'
import { ROUTES } from '@/constants/routes'
import { formatDate, isDeadlinePassed, getDaysUntilDeadline } from '@/utils/formatDate'
import { formatReward } from '@/utils/formatReward'
import { getRelativeTime } from '@/utils/getRelativeTime'
import useAuth from '@/hooks/useAuth'
import { cn } from '@/utils/cn'

const extractId = (val) => {
  if (!val) return null
  if (typeof val === 'string') return val
  return (val._id || val.id)?.toString() || null
}

const HustleDetailsSkeleton = () => (
  <div className="max-w-4xl mx-auto animate-pulse space-y-6">
    <div className="h-64 bg-muted rounded-[15px]" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded" />
          <div className="h-4 bg-muted rounded w-5/6" />
          <div className="h-4 bg-muted rounded w-4/6" />
        </div>
      </div>
      <div className="space-y-4">
        <div className="h-32 bg-muted rounded-[15px]" />
        <div className="h-10 bg-muted rounded" />
      </div>
    </div>
  </div>
)

const ApplicationStatusBanner = ({ status }) => {
  if (status === 'accepted') {
    return (
      <div className="w-full py-3 px-4 rounded-md flex items-center gap-2.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">
            Application Accepted!
          </p>
          <p className="text-xs text-emerald-600/80 dark:text-emerald-500">
            Congratulations! The hustle owner selected you.
          </p>
        </div>
      </div>
    )
  }
  if (status === 'rejected') {
    return (
      <div className="w-full py-3 px-4 rounded-md flex items-center gap-2.5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">
            Application Rejected
          </p>
          <p className="text-xs text-red-600/80 dark:text-red-500">
            The hustle owner selected someone else.
          </p>
        </div>
      </div>
    )
  }
  if (status === 'pending') {
    return (
      <div className="w-full py-3 px-4 rounded-md flex items-center gap-2.5 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <Clock3 className="w-5 h-5 text-yellow-600 dark:text-yellow-400 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-yellow-700 dark:text-yellow-400">
            Application Pending
          </p>
          <p className="text-xs text-yellow-600/80 dark:text-yellow-500">
            Waiting for the hustle owner to review.
          </p>
        </div>
      </div>
    )
  }
  return null
}

const HustleDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [showApplicants, setShowApplicants] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const { data, isLoading, isError } = useHustleById(id)
  const { mutate: apply, isPending: isApplying } = useApplyToHustle()
  const { mutate: deleteHustle, isPending: isDeleting } = useDeleteHustle()
  const { data: myApplicationsData } = useMyApplications()

  const hustle = data?.hustle

  const currentUserId = extractId(user)
  const creatorId = extractId(hustle?.createdBy)
  const isOwner = !!(currentUserId && creatorId && currentUserId === creatorId)

  const deadlinePassed = isDeadlinePassed(hustle?.deadline)
  const daysLeft = getDaysUntilDeadline(hustle?.deadline)
  const isClosed = hustle?.status !== 'active'
  const canApply = !isOwner && !isClosed && !deadlinePassed

  const myApplication = myApplicationsData?.applications?.find((app) => {
    const appHustleId = extractId(app.hustle) || app.hustle?.toString()
    return appHustleId === id
  })
  const alreadyApplied = !!myApplication
  const myApplicationStatus = myApplication?.status || null

  const { data: applicantsData, isLoading: isLoadingApplicants } = useApplicants(
    showApplicants && isOwner ? id : null
  )

  const handleDelete = () => {
    deleteHustle(id, {
      onSuccess: () => navigate(ROUTES.MY_HUSTLES, { replace: true }),
    })
  }

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <HustleDetailsSkeleton />
      </div>
    )
  }

  if (isError || !hustle) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-lg font-semibold text-foreground mb-2">Hustle not found</h2>
        <p className="text-sm text-muted-foreground mb-6">
          This hustle may have been deleted or doesn't exist.
        </p>
        <button
          onClick={() => navigate(ROUTES.DASHBOARD)}
          className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
        >
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Hero image - clickable */}
      {hustle.photo?.url && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-[15px] overflow-hidden mb-6 border border-border relative group cursor-pointer"
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={hustle.photo.url}
            alt={hustle.title}
            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
          {/* Hover overlay hint */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/60 text-white rounded-full p-2.5">
              <ZoomIn className="w-5 h-5" />
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground leading-tight">
                {hustle.title}
              </h1>
              <StatusBadge status={hustle.status} className="shrink-0 mt-1" />
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{hustle.college}</span>
              <span>·</span>
              <Clock className="w-3.5 h-3.5" />
              <span>Posted {getRelativeTime(hustle.createdAt)}</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-[15px] p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">
              About this Hustle
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {hustle.description}
            </p>
          </div>

          <div className="bg-card border border-border rounded-[15px] p-5">
            <h2 className="text-sm font-semibold text-foreground mb-3">Posted by</h2>
            <div className="flex items-center gap-3">
              <AppAvatar
                src={hustle.createdBy?.profilePic?.url}
                name={hustle.createdBy?.fullName}
                size="md"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {hustle.createdBy?.fullName}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{hustle.createdBy?.username} · {hustle.createdBy?.college}
                </p>
              </div>
            </div>
          </div>

          {/* Applicants - owner only */}
          {isOwner && (
            <div className="bg-card border border-border rounded-[15px] overflow-hidden">
              <button
                onClick={() => setShowApplicants((p) => !p)}
                className="w-full flex items-center justify-between p-5 hover:bg-accent transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-semibold text-foreground">
                    Applicants
                  </span>
                </div>
                {showApplicants ? (
                  <ChevronUp className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                )}
              </button>

              {showApplicants && (
                <div className="px-5 pb-5 space-y-3 border-t border-border pt-4">
                  {isLoadingApplicants ? (
                    <div className="space-y-3">
                      {[...Array(2)].map((_, i) => (
                        <div key={i} className="h-16 bg-muted rounded-[12px] animate-pulse" />
                      ))}
                    </div>
                  ) : applicantsData?.applications?.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No applicants yet
                    </p>
                  ) : (
                    applicantsData?.applications?.map((app) => (
                      <ApplicantCard
                        key={app._id}
                        application={app}
                        hustleId={id}
                        hustleStatus={hustle.status}
                      />
                    ))
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="bg-card border border-border rounded-[15px] p-5 space-y-4">
            <h2 className="text-sm font-semibold text-foreground">Details</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <DollarSign className="w-3.5 h-3.5" />
                  Reward
                </div>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {formatReward(hustle.reward)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  Deadline
                </div>
                <div className="text-right">
                  <span className={cn(
                    'text-sm font-medium',
                    deadlinePassed ? 'text-destructive' : 'text-foreground'
                  )}>
                    {formatDate(hustle.deadline)}
                  </span>
                  {!deadlinePassed && daysLeft !== null && (
                    <p className="text-[11px] text-muted-foreground">
                      {daysLeft === 0 ? 'Due today' : `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left`}
                    </p>
                  )}
                  {deadlinePassed && (
                    <p className="text-[11px] text-destructive">Expired</p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5" />
                  College
                </div>
                <span className="text-sm font-medium text-foreground">
                  {hustle.college}
                </span>
              </div>
            </div>
          </div>

          {/* Action area */}
          {!isOwner && (
            <>
              {alreadyApplied ? (
                <ApplicationStatusBanner status={myApplicationStatus} />
              ) : (
                <button
                  onClick={() => apply(id)}
                  disabled={!canApply || isApplying}
                  className={cn(
                    'w-full py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2',
                    canApply
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                  )}
                >
                  {isApplying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Applying...
                    </>
                  ) : isClosed ? (
                    'Hustle Closed'
                  ) : deadlinePassed ? (
                    'Deadline Passed'
                  ) : (
                    'Apply Now'
                  )}
                </button>
              )}
            </>
          )}

          {isOwner && (
            <div className="space-y-2">
              <button
                onClick={() => navigate(ROUTES.HUSTLE_EDIT(id))}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium border border-border hover:bg-accent transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Hustle
              </button>
              <button
                onClick={() => setDeleteOpen(true)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium text-destructive border border-destructive/30 hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Hustle
              </button>
            </div>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        isPending={isDeleting}
        title="Delete this hustle?"
        description="This will permanently delete the hustle and all its applications."
        confirmText="Delete"
        variant="destructive"
      />

      {/* Lightbox - original image viewer */}
      <ImageLightbox
        open={lightboxOpen}
        src={hustle.photo?.url}
        alt={hustle.title}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}

export default HustleDetails