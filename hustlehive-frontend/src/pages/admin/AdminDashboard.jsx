import { useNavigate } from 'react-router-dom'
import { ShieldCheck, Users, Briefcase, FileText, UserCheck, Zap, Flag } from 'lucide-react'
import { useAdminDashboard } from '@/features/admin/useAdmin'
import PageHeader from '@/components/common/PageHeader'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-card border border-border rounded-[15px] p-5 flex items-center gap-4">
    <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center shrink-0', color)}>
      <Icon className="w-6 h-6" />
    </div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value ?? '—'}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  </div>
)

const NAV_ITEMS = [
  {
    label: 'Manage Users',
    desc: 'View, ban and delete users',
    route: '/admin/users',
    icon: Users,
  },
  {
    label: 'Manage Hustles',
    desc: 'View and remove hustles',
    route: '/admin/hustles',
    icon: Briefcase,
  },
  {
    label: 'Manage Applications',
    desc: 'Browse all applications',
    route: '/admin/applications',
    icon: FileText,
  },
  {
    label: 'Reported Users',
    desc: 'Review user reports',
    route: '/admin/reported-users',
    icon: ShieldCheck,
  },
  {
    label: 'Reported Hustles',
    desc: 'Review hustle reports',
    route: '/admin/reported-hustles',
    icon: Flag,
  },
]

const AdminDashboard = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useAdminDashboard()
  const d = data?.dashboard

  return (
    <div className="max-w-5xl mx-auto">
      <PageHeader
        title="Admin Dashboard"
        description="Platform overview and statistics"
      />

      {/* Stats */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-[15px] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={Users}
            label="Total Users"
            value={d?.totalUsers}
            color="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          />
          <StatCard
            icon={Zap}
            label="Total Hustles"
            value={d?.totalHustles}
            color="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
          />
          <StatCard
            icon={Zap}
            label="Active Hustles"
            value={d?.activeHustles}
            color="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
          />
          <StatCard
            icon={ShieldCheck}
            label="Completed Hustles"
            value={d?.completedHustles}
            color="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
          />
          <StatCard
            icon={FileText}
            label="Total Applications"
            value={d?.totalApplications}
            color="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
          />
          <StatCard
            icon={UserCheck}
            label="Total Friendships"
            value={d?.totalFriendships}
            color="bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400"
          />
        </div>
      )}

      {/* Quick navigation */}
      <div className="mt-8">
        <h2 className="text-sm font-semibold text-foreground mb-4">Manage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.route}
              onClick={() => navigate(item.route)}
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-[15px] hover:border-primary/30 hover:shadow-card-hover transition-all cursor-pointer"
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard