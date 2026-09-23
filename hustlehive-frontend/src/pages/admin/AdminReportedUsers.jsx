import { useState } from 'react'
import { Flag, ShieldOff, ShieldCheck, X, ChevronDown, ChevronUp } from 'lucide-react'
import {
  useAdminReportedUsers,
  useBanUser,
  useUnbanUser,
  useDismissUserReports,
  useDeleteReport,
} from '@/features/admin/useAdmin'
import AppAvatar from '@/components/common/AppAvatar'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import { getRelativeTime } from '@/utils/getRelativeTime'
import { cn } from '@/utils/cn'

const AdminReportedUsers = () => {
  const { data, isLoading, refetch } = useAdminReportedUsers()
  const { mutate: ban, isPending: isBanning } = useBanUser()
  const { mutate: unban, isPending: isUnbanning } = useUnbanUser()
  const { mutate: dismiss, isPending: isDismissing } = useDismissUserReports()
  const { mutate: delReport } = useDeleteReport()
  const [expanded, setExpanded] = useState({})
  const [confirmAction, setConfirmAction] = useState(null)

  const reportedUsers = data?.users || []

  const toggleExpand = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }))

  const handleConfirm = () => {
    const { type, userId } = confirmAction
    const opts = { onSuccess: () => { setConfirmAction(null); refetch() } }
    if (type === 'ban') ban(userId, opts)
    if (type === 'unban') unban(userId, opts)
    if (type === 'dismiss') dismiss(userId, opts)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Reported Users"
        description={`${reportedUsers.length} user${reportedUsers.length !== 1 ? 's' : ''} with pending reports`}
      />

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-[15px] animate-pulse" />)}
        </div>
      ) : reportedUsers.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground text-sm">No reported users</div>
      ) : (
        <div className="space-y-4">
          {reportedUsers.map(({ user, reportCount, reports }) => (
            <div key={user._id} className="bg-card border border-border rounded-[15px] overflow-hidden">
              {/* User row */}
              <div className="p-4 flex items-center gap-3">
                <AppAvatar src={user.profilePic?.url} name={user.fullName} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-foreground">{user.fullName}</p>
                    {user.isBanned && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium">Banned</span>
                    )}
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 font-medium flex items-center gap-1">
                      <Flag className="w-2.5 h-2.5" />
                      {reportCount} report{reportCount !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">@{user.username} · {user.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {user.isBanned ? (
                    <button
                      onClick={() => setConfirmAction({ type: 'unban', userId: user._id, name: user.fullName })}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Unban
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmAction({ type: 'ban', userId: user._id, name: user.fullName })}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 hover:bg-red-200 transition-colors"
                    >
                      <ShieldOff className="w-3.5 h-3.5" /> Ban
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmAction({ type: 'dismiss', userId: user._id, name: user.fullName })}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-md border border-border text-muted-foreground hover:bg-accent transition-colors"
                  >
                    <X className="w-3.5 h-3.5" /> Dismiss All
                  </button>
                  <button
                    onClick={() => toggleExpand(user._id)}
                    className="p-1.5 rounded-md text-muted-foreground hover:bg-accent transition-colors"
                  >
                    {expanded[user._id] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Expanded reports */}
              {expanded[user._id] && (
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
                        title="Delete this report"
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
        isPending={isBanning || isUnbanning || isDismissing}
        title={
          confirmAction?.type === 'ban' ? `Ban ${confirmAction?.name}?` :
          confirmAction?.type === 'unban' ? `Unban ${confirmAction?.name}?` :
          `Dismiss all reports for ${confirmAction?.name}?`
        }
        description={
          confirmAction?.type === 'ban' ? 'This user will be prevented from accessing the platform.' :
          confirmAction?.type === 'unban' ? 'This user will regain platform access.' :
          'All pending reports for this user will be marked as dismissed.'
        }
        confirmText={
          confirmAction?.type === 'ban' ? 'Ban User' :
          confirmAction?.type === 'unban' ? 'Unban User' : 'Dismiss All'
        }
        variant={confirmAction?.type === 'ban' ? 'destructive' : 'default'}
      />
    </div>
  )
}

export default AdminReportedUsers