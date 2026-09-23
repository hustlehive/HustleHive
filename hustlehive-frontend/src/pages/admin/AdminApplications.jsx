import { useState } from 'react'
import { Search } from 'lucide-react'
import { useAdminApplications } from '@/features/admin/useAdmin'
import AppAvatar from '@/components/common/AppAvatar'
import StatusBadge from '@/components/common/StatusBadge'
import PageHeader from '@/components/common/PageHeader'
import { formatReward } from '@/utils/formatReward'
import { getRelativeTime } from '@/utils/getRelativeTime'

const AdminApplications = () => {
  const { data, isLoading } = useAdminApplications()
  const [search, setSearch] = useState('')

  const applications = (data?.applications || []).filter((a) => {
    const q = search.toLowerCase()
    return (
      a.applicant?.fullName?.toLowerCase().includes(q) ||
      a.hustle?.title?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="max-w-6xl mx-auto">
      <PageHeader title="Applications" description={`${data?.count ?? 0} total applications`} />

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by applicant or hustle..."
          className="w-full pl-9 pr-4 py-2.5 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-muted rounded-[15px] animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {applications.map((a) => (
            <div key={a._id} className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3">
              <AppAvatar src={a.applicant?.profilePic?.url} name={a.applicant?.fullName} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{a.applicant?.fullName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Applied to: <span className="text-foreground">{a.hustle?.title}</span>
                </p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-muted-foreground flex-wrap">
                  <span>{formatReward(a.hustle?.reward)}</span>
                  <span>·</span>
                  <span>{getRelativeTime(a.createdAt)}</span>
                </div>
              </div>
              <StatusBadge status={a.status} />
            </div>
          ))}
          {applications.length === 0 && (
            <p className="text-center text-muted-foreground py-10 text-sm">No applications found</p>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminApplications