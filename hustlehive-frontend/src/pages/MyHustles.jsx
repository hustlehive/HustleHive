import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Briefcase, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import { getUserHustles } from '@/api/users.api'
import { queryKeys } from '@/constants/queryKeys'
import HustleCard from '@/components/hustle/HustleCard'
import HustleCardSkeleton from '@/components/skeletons/HustleCardSkeleton'
import EmptyState from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import { ROUTES } from '@/constants/routes'
import useAuth from '@/hooks/useAuth'

const MyHustles = () => {
  const navigate = useNavigate()
  const { user } = useAuth()

  // Safely extract ID - handles both _id and id from backend
  const userId = user?._id?.toString() || user?.id?.toString() || null

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.userHustles(userId),
    queryFn: () => getUserHustles(userId),
    enabled: !!userId,
  })

  const hustles = data?.hustles || []

  return (
    <div className="max-w-7xl mx-auto">
      <PageHeader
        title="My Hustles"
        description="All hustles you have created"
        actions={
          <button
            onClick={() => navigate(ROUTES.HUSTLE_CREATE)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Hustle
          </button>
        }
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <HustleCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-3">Failed to load your hustles</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm bg-primary text-white rounded-md"
          >
            Try Again
          </button>
        </div>
      ) : hustles.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No hustles yet"
          description="Create your first hustle and start finding the right person for your tasks."
          action={
            <button
              onClick={() => navigate(ROUTES.HUSTLE_CREATE)}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
            >
              <Plus className="w-4 h-4" />
              Create Hustle
            </button>
          }
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {hustles.map((hustle) => (
            <HustleCard key={hustle._id} hustle={hustle} showIfOwner={true} />
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default MyHustles