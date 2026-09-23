import { ShieldCheck, Users, Briefcase, FileText, UserCheck, Zap } from 'lucide-react'
import { useAdminDashboard } from '@/features/admin/useAdmin'
import PageHeader from '@/components/common/PageHeader'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-card border border-border rounded-[15px] p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value ?? '—'}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
)

const AdminDashboard = () => {
  const { data, isLoading } = useAdminDashboard()
  const d = data?.dashboard

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview and statistics"
      />
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-[15px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard icon={Users} label="Total Users" value={d?.totalUsers} color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" />
          <StatCard icon={Zap} label="Total Hustles" value={d?.totalHustles} color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" />
          <StatCard icon={Zap} label="Active Hustles" value={d?.activeHustles} color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" />
          <StatCard icon={ShieldCheck} label="Completed Hustles" value={d?.completedHustles} color="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400" />
          <StatCard icon={FileText} label="Total Applications" value={d?.totalApplications} color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400" />
          <StatCard icon={UserCheck} label="Total Friendships" value={d?.totalFriendships} color="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" />
        </div>
      )}
    </div>
  )
}

export default AdminDashboard