import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FileText, MessageSquare } from 'lucide-react'
import { toast } from 'sonner'
import { useMyApplications } from '@/features/hustles/useHustles'
import { startConversation } from '@/api/messages.api'
import StatusBadge from '@/components/common/StatusBadge'
import EmptyState from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import { ROUTES } from '@/constants/routes'
import { formatReward } from '@/utils/formatReward'
import { formatDate, isDeadlinePassed } from '@/utils/formatDate'
import { getRelativeTime } from '@/utils/getRelativeTime'
import { cn } from '@/utils/cn'
import { Calendar, DollarSign, Clock } from 'lucide-react'
import useAuth from '@/hooks/useAuth'

const ApplicationCard = ({ application, onMessage }) => {
  const navigate = useNavigate()
  const { hustle, status, createdAt } = application
  const deadlinePassed = isDeadlinePassed(hustle?.deadline)
  const [isMessaging, setIsMessaging] = useState(false)

  const handleMessage = async () => {
    setIsMessaging(true)
    try {
      await onMessage(application)
    } finally {
      setIsMessaging(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-[15px] p-4 hover:border-primary/30 transition-all duration-200 hover:shadow-card-hover"
    >
      {/* Top row — title + status */}
      <div
        onClick={() => navigate(ROUTES.HUSTLE_DETAILS(hustle?._id))}
        className="cursor-pointer"
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-semibold text-foreground leading-snug line-clamp-2 flex-1">
            {hustle?.title || 'Hustle Deleted'}
          </h3>
          <StatusBadge status={status} className="shrink-0" />
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {formatReward(hustle?.reward)}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span className={cn(deadlinePassed && 'text-destructive')}>
              {formatDate(hustle?.deadline)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>Applied {getRelativeTime(createdAt)}</span>
          </div>
          <StatusBadge status={hustle?.status} />
        </div>
      </div>

      {/* Accepted — show message button */}
      {status === 'accepted' && hustle?._id && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            🎉 Your application was accepted!
          </p>
          <button
            onClick={handleMessage}
            disabled={isMessaging}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
          >
            {isMessaging ? (
              <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <MessageSquare className="w-3.5 h-3.5" />
            )}
            Message Owner
          </button>
        </div>
      )}

      {status === 'rejected' && (
        <div className="mt-3 pt-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            This application was not selected.
          </p>
        </div>
      )}
    </motion.div>
  )
}

const ApplicationCardSkeleton = () => (
  <div className="bg-card border border-border rounded-[15px] p-4 animate-pulse space-y-3">
    <div className="flex items-start justify-between gap-3">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-5 bg-muted rounded-full w-16 shrink-0" />
    </div>
    <div className="flex gap-4">
      <div className="h-3 bg-muted rounded w-16" />
      <div className="h-3 bg-muted rounded w-24" />
    </div>
    <div className="flex items-center justify-between">
      <div className="h-3 bg-muted rounded w-24" />
      <div className="h-5 bg-muted rounded-full w-16" />
    </div>
  </div>
)

const MyApplications = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data, isLoading, isError, refetch } = useMyApplications()
  const applications = data?.applications || []

  const pending = applications.filter((a) => a.status === 'pending')
  const accepted = applications.filter((a) => a.status === 'accepted')
  const rejected = applications.filter((a) => a.status === 'rejected')

  // Applicant messages hustle owner
  // Per backend contract: applicant passes their OWN id as participantId
  const handleMessage = async (application) => {
    const hustleId = application.hustle?._id || application.hustle?.id || application.hustle
    const myId = (user?._id || user?.id)?.toString()

    try {
      const data = await startConversation({
        type: 'hustle',
        hustleId,
        participantId: myId, // applicant passes their own ID
      })
      navigate(ROUTES.CONVERSATION(data.conversation._id))
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="My Applications"
        description="Track all hustles you have applied for"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <ApplicationCardSkeleton key={i} />)}
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-3">Failed to load applications</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm bg-primary text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No applications yet"
          description="Browse hustles on the dashboard and apply to ones that interest you."
        />
      ) : (
        <div className="space-y-8">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Pending', count: pending.length, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' },
              { label: 'Accepted', count: accepted.length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' },
              { label: 'Rejected', count: rejected.length, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' },
            ].map((item) => (
              <div key={item.label} className={cn('rounded-[12px] border p-4 text-center', item.bg)}>
                <p className={cn('text-2xl font-bold', item.color)}>{item.count}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>

          {accepted.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                Accepted ({accepted.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {accepted.map((app) => (
                  <ApplicationCard key={app._id} application={app} onMessage={handleMessage} />
                ))}
              </div>
            </div>
          )}

          {pending.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-500 inline-block" />
                Pending ({pending.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {pending.map((app) => (
                  <ApplicationCard key={app._id} application={app} onMessage={handleMessage} />
                ))}
              </div>
            </div>
          )}

          {rejected.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
                Rejected ({rejected.length})
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {rejected.map((app) => (
                  <ApplicationCard key={app._id} application={app} onMessage={handleMessage} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MyApplications