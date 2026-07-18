import { useState, useMemo } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
} from 'lucide-react'
import { useHustlesList } from '@/features/hustles/useHustles'
import HustleCard from '@/components/hustle/HustleCard'
import HustleCardSkeleton from '@/components/skeletons/HustleCardSkeleton'
import EmptyState from '@/components/common/EmptyState'
import Pagination from '@/components/common/Pagination'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import useDebounce from '@/hooks/useDebounce'
import useAuth from '@/hooks/useAuth'

const extractId = (val) => {
  if (!val) return null
  if (typeof val === 'string') return val
  return (val._id || val.id)?.toString() || null
}

const SORT_OPTIONS = [
  { label: 'Newest', value: '' },
  { label: 'Oldest', value: 'oldest' },
  { label: 'Reward: Low to High', value: 'reward-asc' },
  { label: 'Reward: High to Low', value: 'reward-desc' },
  { label: 'Deadline', value: 'deadline' },
]

const STATUS_OPTIONS = ['active', 'assigned', 'completed', 'cancelled']
const COLLEGE_OPTIONS = ['NSUT', 'DTU', 'IGDTUW']

const Dashboard = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()

  const [search, setSearch] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)
  const [sort, setSort] = useState('')
  const [status, setStatus] = useState('')
  const [college, setCollege] = useState('')
  const [minReward, setMinReward] = useState('')
  const [maxReward, setMaxReward] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortOpen, setSortOpen] = useState(false)

  const debouncedSearch = useDebounce(search, 400)

  const filters = useMemo(() => ({
    page,
    limit: 12,
    ...(debouncedSearch && { search: debouncedSearch }),
    ...(sort && { sort }),
    ...(status && { status }),
    ...(college && { college }),
    ...(minReward && { minReward: Number(minReward) }),
    ...(maxReward && { maxReward: Number(maxReward) }),
  }), [page, debouncedSearch, sort, status, college, minReward, maxReward])

  const { data, isLoading, isError, refetch } = useHustlesList(filters)

  const hustles = data?.hustles || []
  const totalPages = data?.totalPages || 1

  // Count only hustles not created by current user for display
  const currentUserId = extractId(user)
  const visibleHustles = hustles.filter((h) => {
    const creatorId = extractId(h.createdBy)
    return currentUserId && creatorId ? currentUserId !== creatorId : true
  })

  const hasActiveFilters = status || college || minReward || maxReward

  const clearFilters = () => {
    setStatus('')
    setCollege('')
    setMinReward('')
    setMaxReward('')
    setPage(1)
  }

  const handleSearch = (val) => {
    setSearch(val)
    setPage(1)
  }

  const handlePageChange = (p) => {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Subtitle text
  const getSubtitle = () => {
    if (isLoading) return 'Loading hustles...'
    if (visibleHustles.length === 0 && hustles.length > 0) {
      return 'No hustles from others to show'
    }
    return `${visibleHustles.length} hustle${visibleHustles.length !== 1 ? 's' : ''} available`
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {getSubtitle()}
          </p>
        </div>
      </div>

      {/* Search + Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search hustles..."
            className={cn(
              'w-full pl-9 pr-4 py-2.5 text-sm rounded-md border border-input bg-background',
              'text-foreground placeholder:text-muted-foreground',
              'outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
            )}
          />
          {search && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <button
            onClick={() => setSortOpen((p) => !p)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border border-input',
              'bg-background text-foreground hover:bg-accent transition-colors whitespace-nowrap'
            )}
          >
            <span>{SORT_OPTIONS.find((o) => o.value === sort)?.label || 'Sort'}</span>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>

          <AnimatePresence>
            {sortOpen && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-[12px] shadow-lg z-20 overflow-hidden py-1"
              >
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value)
                      setPage(1)
                      setSortOpen(false)
                    }}
                    className={cn(
                      'w-full text-left px-4 py-2 text-sm transition-colors',
                      sort === opt.value
                        ? 'text-primary font-medium bg-primary/5'
                        : 'text-foreground hover:bg-accent'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Filters toggle */}
        <button
          onClick={() => setShowFilters((p) => !p)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-md border transition-colors whitespace-nowrap',
            hasActiveFilters
              ? 'border-primary text-primary bg-primary/5'
              : 'border-input text-foreground bg-background hover:bg-accent'
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasActiveFilters && (
            <span className="w-4 h-4 bg-primary text-white text-[10px] rounded-full flex items-center justify-center font-bold">
              !
            </span>
          )}
        </button>
      </div>

      {/* Filter panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-card border border-border rounded-[15px] p-4 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Status */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => { setStatus(e.target.value); setPage(1) }}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">All Statuses</option>
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* College */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    College
                  </label>
                  <select
                    value={college}
                    onChange={(e) => { setCollege(e.target.value); setPage(1) }}
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                  >
                    <option value="">All Colleges</option>
                    {COLLEGE_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Min Reward */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Min Reward (₹)
                  </label>
                  <input
                    type="number"
                    value={minReward}
                    onChange={(e) => { setMinReward(e.target.value); setPage(1) }}
                    placeholder="0"
                    min="0"
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>

                {/* Max Reward */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Max Reward (₹)
                  </label>
                  <input
                    type="number"
                    value={maxReward}
                    onChange={(e) => { setMaxReward(e.target.value); setPage(1) }}
                    placeholder="Any"
                    min="0"
                    className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder:text-muted-foreground"
                  />
                </div>
              </div>

              {hasActiveFilters && (
                <div className="mt-3 pt-3 border-t border-border">
                  <button
                    onClick={clearFilters}
                    className="text-xs text-destructive hover:underline font-medium"
                  >
                    Clear all filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(12)].map((_, i) => (
            <HustleCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-3">Failed to load hustles</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Try Again
          </button>
        </div>
      ) : visibleHustles.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No hustles found"
          description={
            debouncedSearch || hasActiveFilters
              ? 'Try adjusting your search or filters.'
              : hustles.length > 0
              ? 'All available hustles were posted by you. Create more or check back later.'
              : 'Be the first to post a hustle!'
          }
          action={
            <button
              onClick={() => navigate(ROUTES.HUSTLE_CREATE)}
              className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Create a Hustle
            </button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {hustles.map((hustle) => (
              <HustleCard key={hustle._id} hustle={hustle} />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </>
      )}

      {/* Floating Create Button */}
      {/* <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(ROUTES.HUSTLE_CREATE)}
        className={cn(
          'fixed bottom-6 right-6 z-20',
          'flex items-center gap-2 px-5 py-3 rounded-full shadow-lg',
          'bg-primary text-white font-medium text-sm',
          'hover:bg-primary/90 transition-colors'
        )}
        aria-label="Create a hustle"
      >
        <Plus className="w-5 h-5" />
        <span className="hidden sm:inline">Create Hustle</span>
      </motion.button> */}
    </div>
  )
}

export default Dashboard