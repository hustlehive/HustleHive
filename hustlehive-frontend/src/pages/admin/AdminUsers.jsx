import { useState } from 'react'
import { Search, Trash2, ShieldOff, ShieldCheck, Loader2 } from 'lucide-react'
import { useAdminUsers, useDeleteAdminUser, useBanUser, useUnbanUser } from '@/features/admin/useAdmin'
import AppAvatar from '@/components/common/AppAvatar'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import { getRelativeTime } from '@/utils/getRelativeTime'
import { cn } from '@/utils/cn'

const AdminUsers = () => {
  const { data, isLoading } = useAdminUsers()
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteAdminUser()
  const { mutate: ban, isPending: isBanning } = useBanUser()
  const { mutate: unban, isPending: isUnbanning } = useUnbanUser()
  const [search, setSearch] = useState('')
  const [confirmAction, setConfirmAction] = useState(null) // { type, user }

  const users = (data?.users || []).filter((u) => {
    const q = search.toLowerCase()
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.username?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  })

  const handleConfirm = () => {
    const { type, user } = confirmAction
    if (type === 'delete') deleteUser(user._id, { onSuccess: () => setConfirmAction(null) })
    if (type === 'ban') ban(user._id, { onSuccess: () => setConfirmAction(null) })
    if (type === 'unban') unban(user._id, { onSuccess: () => setConfirmAction(null) })
  }

  const isPending = isDeleting || isBanning || isUnbanning

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Users" description={`${data?.count ?? 0} registered users`} />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, username or email..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-[15px] animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {users.map((u) => (
            <div key={u._id} className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3">
              <AppAvatar src={u.profilePic?.url} name={u.fullName} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold text-foreground truncate">{u.fullName}</p>
                  {u.isBanned && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-medium">Banned</span>
                  )}
                  {u.role === 'admin' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">Admin</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">@{u.username} · {u.email} · {u.college}</p>
                <p className="text-xs text-muted-foreground">Joined {getRelativeTime(u.createdAt)}</p>
              </div>
              {u.role !== 'admin' && (
                <div className="flex items-center gap-2 shrink-0">
                  {u.isBanned ? (
                    <button
                      onClick={() => setConfirmAction({ type: 'unban', user: u })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Unban
                    </button>
                  ) : (
                    <button
                      onClick={() => setConfirmAction({ type: 'ban', user: u })}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-200 transition-colors"
                    >
                      <ShieldOff className="w-3.5 h-3.5" />
                      Ban
                    </button>
                  )}
                  <button
                    onClick={() => setConfirmAction({ type: 'delete', user: u })}
                    className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
          {users.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm">No users found</p>
          )}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={handleConfirm}
        isPending={isPending}
        title={
          confirmAction?.type === 'delete' ? `Delete ${confirmAction.user.fullName}?` :
          confirmAction?.type === 'ban' ? `Ban ${confirmAction?.user?.fullName}?` :
          `Unban ${confirmAction?.user?.fullName}?`
        }
        description={
          confirmAction?.type === 'delete'
            ? 'This will permanently delete the user and all associated data.'
            : confirmAction?.type === 'ban'
            ? 'The user will be prevented from accessing the platform.'
            : 'The user will regain access to the platform.'
        }
        confirmText={
          confirmAction?.type === 'delete' ? 'Delete' :
          confirmAction?.type === 'ban' ? 'Ban User' : 'Unban User'
        }
        variant={confirmAction?.type === 'unban' ? 'default' : 'destructive'}
      />
    </div>
  )
}

export default AdminUsers