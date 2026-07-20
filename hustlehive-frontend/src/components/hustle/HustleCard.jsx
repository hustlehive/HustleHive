import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, MapPin, Clock, Zap } from 'lucide-react'
import { cn } from '@/utils/cn'
import { ROUTES } from '@/constants/routes'
import { formatReward } from '@/utils/formatReward'
import { formatDate, isDeadlinePassed } from '@/utils/formatDate'
import { getRelativeTime } from '@/utils/getRelativeTime'
import StatusBadge from '@/components/common/StatusBadge'
import AppAvatar from '@/components/common/AppAvatar'
import useAuth from '@/hooks/useAuth'
import { useApplyToHustle, useMyApplications } from '@/features/hustles/useHustles'

// Safely extract id - handles populated object, plain string ObjectId, or object with id/_id
const extractId = (val) => {
  if (!val) return null
  if (typeof val === 'string') return val
  return (val._id || val.id)?.toString() || null
}

const HustleCard = ({ hustle, showIfOwner = false }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { mutate: apply, isPending: isApplying } = useApplyToHustle()

  const {
    _id,
    title,
    description,
    reward,
    deadline,
    status,
    photo,
    createdBy,
    college,
    createdAt,
  } = hustle

  const currentUserId = extractId(user)
  const creatorId = extractId(createdBy)
  const isOwner = !!(currentUserId && creatorId && currentUserId === creatorId)

  const { data: myApplicationsData } = useMyApplications()
  const alreadyApplied = myApplicationsData?.applications?.some((app) => {
    const appHustleId = extractId(app.hustle) || app.hustle?.toString()
    return appHustleId === _id?.toString()
  }) ?? false

  if (isOwner && !showIfOwner) return null

  const deadlinePassed = isDeadlinePassed(deadline)
  const canApply = !isOwner && status === 'active' && !deadlinePassed

  // createdBy may be unpopulated (just an id string) - handle gracefully
  const creatorName = typeof createdBy === 'object' ? createdBy?.fullName : null
  const creatorPic = typeof createdBy === 'object' ? createdBy?.profilePic?.url : null

  const handleCardClick = () => navigate(ROUTES.HUSTLE_DETAILS(_id))

  const handleApply = (e) => {
    e.stopPropagation()
    apply(_id)
  }

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      onClick={handleCardClick}
      className="bg-card border border-border rounded-[15px] overflow-hidden cursor-pointer hover:border-primary/30 hover:shadow-card-hover transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-40 bg-muted overflow-hidden">
        {photo?.url ? (
          <img
            src={photo.url}
            alt={title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/5">
            <Zap className="w-10 h-10 text-primary/20" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <StatusBadge status={status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
          <span className="text-xs text-muted-foreground truncate">{college}</span>
        </div>

        <h3 className="text-sm font-semibold text-foreground leading-snug mb-2 line-clamp-2">
          {title}
        </h3>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>

        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatReward(reward)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className={cn(deadlinePassed && 'text-destructive')}>
              {formatDate(deadline)}
            </span>
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AppAvatar
              src={creatorPic}
              name={creatorName}
              size="xs"
            />
            <div className="min-w-0">
              {creatorName && (
                <p className="text-xs text-muted-foreground truncate">
                  {creatorName}
                </p>
              )}
              <div className="flex items-center gap-1">
                <Clock className="w-2.5 h-2.5 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">
                  {getRelativeTime(createdAt)}
                </span>
              </div>
            </div>
          </div>

          {canApply && !alreadyApplied && (
            <button
              onClick={handleApply}
              disabled={isApplying}
              className={cn(
                'shrink-0 px-3 py-1.5 text-xs font-medium rounded-md transition-colors',
                'bg-primary text-white hover:bg-primary/90',
                'disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-1'
              )}
            >
              {isApplying ? (
                <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Apply'
              )}
            </button>
          )}
          {canApply && alreadyApplied && (
            <span className="shrink-0 px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground">
              Applied
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default memo(HustleCard)