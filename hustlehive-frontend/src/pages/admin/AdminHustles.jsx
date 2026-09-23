import { useState } from 'react'
import { Search, Trash2 } from 'lucide-react'
import { useAdminHustles, useDeleteAdminHustle } from '@/features/admin/useAdmin'
import AppAvatar from '@/components/common/AppAvatar'
import StatusBadge from '@/components/common/StatusBadge'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import { formatReward } from '@/utils/formatReward'
import { formatDate } from '@/utils/formatDate'

const AdminHustles = () => {
  const { data, isLoading } = useAdminHustles()
  const { mutate: deleteHustle, isPending } = useDeleteAdminHustle()
  const [search, setSearch] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const hustles = (data?.hustles || []).filter((h) =>
    h.title?.toLowerCase().includes(search.toLowerCase()) ||
    h.createdBy?.fullName?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Hustles" description={`${data?.count ?? 0} total hustles`} />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title or creator..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-[15px] animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {hustles.map((h) => (
            <div key={h._id} className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">{h.title}</p>
                  <StatusBadge status={h.status} />
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <AppAvatar src={h.createdBy?.profilePic?.url} name={h.createdBy?.fullName} size="xs" />
                    {h.createdBy?.fullName}
                  </div>
                  <span>{formatReward(h.reward)}</span>
                  <span>Deadline: {formatDate(h.deadline)}</span>
                  <span>{h.college}</span>
                </div>
              </div>
              <button
                onClick={() => setConfirmId(h._id)}
                className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {hustles.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm">No hustles found</p>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={() => deleteHustle(confirmId, { onSuccess: () => setConfirmId(null) })}
        isPending={isPending}
        title="Delete this hustle?"
        description="This will permanently delete the hustle and all its applications."
        confirmText="Delete"
        variant="destructive"
      />
    </div>
  )
}

export default AdminHustles