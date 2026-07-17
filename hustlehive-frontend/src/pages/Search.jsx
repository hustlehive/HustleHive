import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search as SearchIcon, Users, Zap, UserPlus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { searchUsers } from '@/api/users.api'
import { getHustles } from '@/api/hustles.api'
import { queryKeys } from '@/constants/queryKeys'
import HustleCard from '@/components/hustle/HustleCard'
import HustleCardSkeleton from '@/components/skeletons/HustleCardSkeleton'
import AppAvatar from '@/components/common/AppAvatar'
import EmptyState from '@/components/common/EmptyState'
import Pagination from '@/components/common/Pagination'
import { useSendFriendRequest } from '@/features/users/useFriends'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import useDebounce from '@/hooks/useDebounce'

const TABS = [
  { id: 'hustles', label: 'Hustles', icon: Zap },
  { id: 'users', label: 'Users', icon: Users },
]

const UserSearchCard = ({ user }) => {
  const navigate = useNavigate()
  const { mutate: sendRequest, isPending } = useSendFriendRequest()
  const userId = user._id || user.id
  const status = user.relationshipStatus

  const getAction = () => {
    if (status === 'friend') {
      return (
        <span className="px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Friends ✓
        </span>
      )
    }
    if (status === 'pending_sent') {
      return (
        <span className="px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground border border-border">
          Sent
        </span>
      )
    }
    if (status === 'pending_received') {
      return (
        <span className="px-3 py-1.5 text-xs font-medium rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
          Received
        </span>
      )
    }
    return (
      <button
        onClick={(e) => { e.stopPropagation(); sendRequest(userId) }}
        disabled={isPending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        <UserPlus className="w-3.5 h-3.5" />
        {isPending ? 'Sending...' : 'Add'}
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => navigate(ROUTES.PUBLIC_PROFILE(userId))}
      className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
    >
      <AppAvatar src={user.profilePic?.url} name={user.fullName} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{user.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
        <p className="text-xs text-muted-foreground truncate">{user.college}</p>
        {user.bio && (
          <p className="text-xs text-muted-foreground truncate italic mt-0.5">{user.bio}</p>
        )}
      </div>
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        {getAction()}
      </div>
    </motion.div>
  )
}

const UserCardSkeleton = () => (
  <div className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-3.5 bg-muted rounded w-32" />
      <div className="h-3 bg-muted rounded w-24" />
    </div>
    <div className="h-8 bg-muted rounded w-16 shrink-0" />
  </div>
)

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState('hustles')
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [page, setPage] = useState(1)
  const debouncedQuery = useDebounce(query, 350)

  // Sync URL param to input on mount
  useEffect(() => {
    const q = searchParams.get('q')
    if (q) setQuery(q)
  }, [])

  // Update URL when query changes
  useEffect(() => {
    if (debouncedQuery) {
      setSearchParams({ q: debouncedQuery })
    } else {
      setSearchParams({})
    }
    setPage(1)
  }, [debouncedQuery])

  // Hustle search
  const { data: hustleData, isLoading: loadingHustles } = useQuery({
    queryKey: queryKeys.hustles({ search: debouncedQuery, page, limit: 12 }),
    queryFn: () => getHustles({ search: debouncedQuery, page, limit: 12 }),
    enabled: activeTab === 'hustles' && !!debouncedQuery,
    staleTime: 20_000,
  })

  // User search
  const { data: userData, isLoading: loadingUsers } = useQuery({
    queryKey: queryKeys.userSearch(debouncedQuery),
    queryFn: () => searchUsers(debouncedQuery),
    enabled: activeTab === 'users' && !!debouncedQuery,
    staleTime: 15_000,
  })

  const hustles = hustleData?.hustles || []
  const totalPages = hustleData?.totalPages || 1
  const users = userData?.users || []

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground mb-1">Search</h1>
        <p className="text-sm text-muted-foreground">Find hustles and connect with students</p>
      </div>

      {/* Search input */}
      <div className="relative mb-5">
        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={activeTab === 'hustles' ? 'Search hustles...' : 'Search by username...'}
          autoFocus
          className={cn(
            'w-full pl-11 pr-4 py-3 text-sm rounded-[12px] border border-input bg-background',
            'text-foreground placeholder:text-muted-foreground',
            'outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
          )}
        />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg mb-6 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setPage(1) }}
            className={cn(
              'flex items-center gap-2 px-5 py-2 rounded-md text-sm font-medium transition-all',
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Hustles */}
        {activeTab === 'hustles' && (
          <motion.div
            key="hustles"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {!debouncedQuery ? (
              <EmptyState
                icon={Zap}
                title="Search for hustles"
                description="Type something to search through all available hustles."
              />
            ) : loadingHustles ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <HustleCardSkeleton key={i} />)}
              </div>
            ) : hustles.length === 0 ? (
              <EmptyState
                icon={SearchIcon}
                title="No hustles found"
                description={`No hustles match "${debouncedQuery}".`}
              />
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-4">
                  {hustleData?.total} result{hustleData?.total !== 1 ? 's' : ''} for "{debouncedQuery}"
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {hustles.map((hustle) => (
                    <HustleCard key={hustle._id} hustle={hustle} />
                  ))}
                </div>
                <div className="mt-6">
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  />
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* Users */}
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {!debouncedQuery ? (
              <EmptyState
                icon={Users}
                title="Search for students"
                description="Type a username to find students from NSUT, DTU, and IGDTUW."
              />
            ) : loadingUsers ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <UserCardSkeleton key={i} />)}
              </div>
            ) : users.length === 0 ? (
              <EmptyState
                icon={SearchIcon}
                title="No users found"
                description={`No students found with username "${debouncedQuery}".`}
              />
            ) : (
              <>
                <p className="text-xs text-muted-foreground mb-4">
                  {users.length} result{users.length !== 1 ? 's' : ''} for "{debouncedQuery}"
                </p>
                <div className="space-y-3">
                  {users.map((user) => (
                    <UserSearchCard key={user._id || user.id} user={user} />
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Search