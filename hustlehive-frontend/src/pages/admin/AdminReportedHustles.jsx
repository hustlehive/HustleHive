import { useState } from 'react'
import { Flag, Trash2, RotateCcw, X, ChevronDown, ChevronUp } from 'lucide-react'
import {
  useAdminReportedHustles,
  useDismissHustleReports,
  useDeleteReportedHustle,
  useRestoreHustle,
  useDeleteReport,
} from '@/features/admin/useAdmin'
import AppAvatar from '@/components/common/AppAvatar'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import { formatReward } from '@/utils/formatReward'
import { getRelativeTime } from '@/utils/getRelativeTime'

const AdminReportedHustles = () => {
  const { data, isLoading, refetch } = useAdminReportedHustles()
  const { mutate: dismiss, isPending: isDismissing } = useDismissHustleReports()
  const { mutate: deleteHustle, isPending: isDeleting } = useDeleteReportedHustle()
  const { mutate: restore, isPending: isRestoring } = useRestoreHustle()
  const { mutate: delReport } = useDeleteReport()
  const [expanded, setExpanded] = useState({})
  const [confirmAction, setConfirmAction] = useState(null)

  const reportedHustles = data?.hustles || []

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }))

  const handleConfirm = () => {
    const { type, hustleId } = confirmAction
    const opts = { onSuccess: () => { setConfirmAction(null); refetch() } }
    if (type === 'delete') deleteHustle(hustleId, opts)
    if (type === 'restore') restore(hustleId, opts)
    if (type === 'dismiss') dismiss(hustleId, opts)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Reported Hustles"
        description={`${reportedHustles.length} hustle${reportedHustles.length !== 1 ? 's' : ''} with pending reports`}
      />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-[15px] animate-pulse" />)}
        </div>
      ) : reportedHustles.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No reported hustles</div>
      ) : (
        <div className="space-y-4">
          {reportedHustles.map(({ hustle, reportCount, reports }) => (
            <div key={hustle._id} className="bg-card border border-border rounded-[15px] overflow-hidden">
              <div className="p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <p className="text-sm font-semibold text-foreground truncate">{hustle.title}</p>
                    <StatusBadge status={hustle.status} />
                    {hustle.isDeletedByAdmin && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium">Removed</span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-medium flex items-center gap-1">
                      <Flag className="w-2.5 h-2.5" />
                      {reportCount} report{reportCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                    <AppAvatar src={hustle.createdBy?.profilePic?.url} name={hustle.createdBy?.fullName} size="xs" />
                    <span>{hustle.createdBy?.fullName}</span>
                    <span>·</span>
                    <span>{formatReward(hustle.reward)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {hustle.isDeletedByAdmin ? (
                    <button
                      onClick={() => setConfirmAction({ type: 'restore', hustleId: hustle._id, title: hustle.title })}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" /> Restore
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmAction({ type: 'delete', hustleId: hustle._id, title: hustle.title })}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remove
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmAction({ type: 'dismiss', hustleId: hustle._id, title: hustle.title })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-border text-muted-foreground hover:bg-accent transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Dismiss
                  </button>
                  <button
                    onClick={() => toggleExpand(hustle._id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-accent transition-colors"
                  >
                    {expanded[hustle._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {expanded[hustle._id] && (
                <div className="border-t border-border divide-y divide-border">
                  {reports.map((r) => (
                    <div key={r._id} className="px-4 py-3 flex items-start gap-3">
                      <AppAvatar src={r.reportedBy?.profilePic?.url} name={r.reportedBy?.fullName} size="xs" className="mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">{r.reportedBy?.fullName} <span className="text-muted-foreground font-normal">· {getRelativeTime(r.createdAt)}</span></p>
                        <p className="text-xs text-muted-foreground mt-0.5"><span className="font-medium text-foreground">Reason:</span> {r.reason}</p>
                        {r.description && <p className="text-xs text-muted-foreground mt-0.5">{r.description}</p>}
                      </div>
                      <button
                        onClick={() => delReport(r._id, { onSuccess: refetch })}
                        className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        isPending={isDeleting || isRestoring || isDismissing}
        title={
          confirmAction?.type === 'delete' ? `Remove "${confirmAction?.title}"?` :
          confirmAction?.type === 'restore' ? `Restore "${confirmAction?.title}"?` :
          `Dismiss all reports for "${confirmAction?.title}"?`
        }
        description={
          confirmAction?.type === 'delete' ? 'The hustle will be hidden from the platform.' :
          confirmAction?.type === 'restore' ? 'The hustle will be visible on the platform again.' :
          'All pending reports for this hustle will be marked as dismissed.'
        }
        confirmText={
          confirmAction?.type === 'delete' ? 'Remove' :
          confirmAction?.type === 'restore' ? 'Restore' : 'Dismiss All'
        }
        variant={confirmAction?.type === 'delete' ? 'destructive' : 'default'}
      />
    </div>
  )
}

export default AdminReportedHustles