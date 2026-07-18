import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  UserPlus,
  Clock,
  Search,
  MessageSquare,
  UserMinus,
  Check,
  X,
  SendHorizonal,
} from 'lucide-react'
import {
  useFriends,
  useReceivedRequests,
  useSentRequests,
  useSendFriendRequest,
  useAcceptFriendRequest,
  useRejectFriendRequest,
  useCancelFriendRequest,
  useUnfriend,
  useUserSearch,
} from '@/features/users/useFriends'
import { startConversation } from '@/api/messages.api'
import AppAvatar from '@/components/common/AppAvatar'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import PageHeader from '@/components/common/PageHeader'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import useDebounce from '@/hooks/useDebounce'
import { toast } from 'sonner'
import useAuth from '@/hooks/useAuth'

const TABS = [
  { id: 'friends', label: 'Friends', icon: Users },
  { id: 'received', label: 'Received', icon: UserPlus },
  { id: 'sent', label: 'Sent', icon: SendHorizonal },
  { id: 'search', label: 'Find People', icon: Search },
]

// ── Friend Card ──
const FriendCard = ({ friend }) => {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const { mutate: unfriend, isPending } = useUnfriend()
  const [confirmOpen, setConfirmOpen] = useState(false)
  const friendId = (friend._id || friend.id)?.toString()
  const currentUserId = (authUser?._id || authUser?.id)?.toString()

  const handleMessage = async (e) => {
    e.stopPropagation()
    try {
      const data = await startConversation({ type: 'friend', friendId })
      navigate(ROUTES.CONVERSATION(data.conversation._id))
    } catch (err) {
      toast.error(err.message)
    }
  }

  const handleUnfriend = (e) => {
    e.stopPropagation()
    setConfirmOpen(true)
  }

  const handleViewProfile = (e) => {
    e.stopPropagation()
    if (friendId === currentUserId) {
      navigate(ROUTES.PROFILE)
    } else {
      navigate(ROUTES.PUBLIC_PROFILE(friendId))
    }
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        onClick={() => navigate(ROUTES.PUBLIC_PROFILE(friendId))}
        className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
      >
        <AppAvatar src={friend.profilePic?.url} name={friend.fullName} size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground truncate">{friend.fullName}</p>
          <p className="text-xs text-muted-foreground truncate">@{friend.username}</p>
          <p className="text-xs text-muted-foreground truncate">{friend.college}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleMessage}
            title="Message"
            className="p-2 rounded-md text-primary hover:bg-primary/10 transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={handleUnfriend}
            title="Unfriend"
            className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <UserMinus className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => unfriend(friendId, { onSuccess: () => setConfirmOpen(false) })}
        isPending={isPending}
        title="Unfriend this person?"
        description={`You will no longer be friends with ${friend.fullName}.`}
        confirmText="Unfriend"
        variant="destructive"
      />
    </>
  )
}

// ── Received Request Card ──
const ReceivedRequestCard = ({ request }) => {
  const navigate = useNavigate()
  const { mutate: accept, isPending: isAccepting } = useAcceptFriendRequest()
  const { mutate: reject, isPending: isRejecting } = useRejectFriendRequest()
  const sender = request.sender
  const senderId = (sender?._id || sender?.id)?.toString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => senderId && navigate(ROUTES.PUBLIC_PROFILE(senderId))}
      className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
    >
      <AppAvatar src={sender?.profilePic?.url} name={sender?.fullName} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{sender?.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">@{sender?.username}</p>
        <p className="text-xs text-muted-foreground truncate">{sender?.college}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={(e) => { e.stopPropagation(); accept(request._id) }}
          disabled={isAccepting || isRejecting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          <Check className="w-3.5 h-3.5" />
          Accept
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); reject(request._id) }}
          disabled={isAccepting || isRejecting}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-60"
        >
          <X className="w-3.5 h-3.5" />
          Reject
        </button>
      </div>
    </motion.div>
  )
}

// ── Sent Request Card ──
const SentRequestCard = ({ request }) => {
  const navigate = useNavigate()
  const { mutate: cancel, isPending } = useCancelFriendRequest()
  const receiver = request.receiver
  const receiverId = (receiver?._id || receiver?.id)?.toString()

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => receiverId && navigate(ROUTES.PUBLIC_PROFILE(receiverId))}
      className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
    >
      <AppAvatar src={receiver?.profilePic?.url} name={receiver?.fullName} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{receiver?.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">@{receiver?.username}</p>
        <p className="text-xs text-muted-foreground truncate">{receiver?.college}</p>
      </div>
      <button
        onClick={(e) => { e.stopPropagation(); cancel(request._id) }}
        disabled={isPending}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors disabled:opacity-60"
      >
        <X className="w-3.5 h-3.5" />
        Cancel
      </button>
    </motion.div>
  )
}

// ── Search User Card ──
const SearchUserCard = ({ user }) => {
  const navigate = useNavigate()
  const { mutate: sendRequest, isPending: isSending } = useSendFriendRequest()
  const userId = (user._id || user.id)?.toString()
  const status = user.relationshipStatus

  const getActionButton = () => {
    if (status === 'friend') {
      return (
        <span className="px-3 py-1.5 text-xs font-medium rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          Friends
        </span>
      )
    }
    if (status === 'pending_sent') {
      return (
        <span className="px-3 py-1.5 text-xs font-medium rounded-md bg-muted text-muted-foreground border border-border">
          Request Sent
        </span>
      )
    }
    if (status === 'pending_received') {
      return (
        <span className="px-3 py-1.5 text-xs font-medium rounded-md bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
          Respond ↑
        </span>
      )
    }
    return (
      <button
        onClick={(e) => { e.stopPropagation(); sendRequest(userId) }}
        disabled={isSending}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        <UserPlus className="w-3.5 h-3.5" />
        {isSending ? 'Sending...' : 'Add Friend'}
      </button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={() => userId && navigate(ROUTES.PUBLIC_PROFILE(userId))}
      className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
    >
      <AppAvatar src={user.profilePic?.url} name={user.fullName} size="md" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate">{user.fullName}</p>
        <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
        <p className="text-xs text-muted-foreground truncate">{user.college}</p>
        {user.bio && (
          <p className="text-xs text-muted-foreground truncate mt-0.5 italic">{user.bio}</p>
        )}
      </div>
      <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
        {getActionButton()}
      </div>
    </motion.div>
  )
}

// ── Skeleton ──
const CardSkeleton = () => (
  <div className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-muted shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-3.5 bg-muted rounded w-32" />
      <div className="h-3 bg-muted rounded w-24" />
      <div className="h-3 bg-muted rounded w-16" />
    </div>
    <div className="h-8 bg-muted rounded w-20 shrink-0" />
  </div>
)

// ── Main Friends Page ──
const Friends = () => {
  const [activeTab, setActiveTab] = useState('friends')
  const [searchQuery, setSearchQuery] = useState('')
  const debouncedSearch = useDebounce(searchQuery, 350)

  const { data: friendsData, isLoading: loadingFriends } = useFriends()
  const { data: receivedData, isLoading: loadingReceived } = useReceivedRequests()
  const { data: sentData, isLoading: loadingSent } = useSentRequests()
  const { data: searchData, isLoading: loadingSearch } = useUserSearch(
    activeTab === 'search' ? debouncedSearch : null
  )

  const friends = friendsData?.friends || []
  const received = receivedData?.requests || []
  const sent = sentData?.requests || []
  const searchResults = searchData?.users || []

  const tabCounts = {
    friends: friends.length,
    received: received.length,
    sent: sent.length,
  }

  return (
    <div className="max-w-4xl mx-auto">
      <PageHeader
        title="Friends"
        description="Manage your connections and friend requests"
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg mb-6 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center',
              activeTab === tab.id
                ? 'bg-card text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {tabCounts[tab.id] > 0 && (
              <span className={cn(
                'text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1',
                tab.id === 'received'
                  ? 'bg-primary text-white'
                  : 'bg-muted-foreground/20 text-muted-foreground'
              )}>
                {tabCounts[tab.id]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 'friends' && (
          <motion.div
            key="friends"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {loadingFriends ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : friends.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No friends yet"
                description="Use the Find People tab to search for and connect with other students."
              />
            ) : (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <FriendCard key={friend._id || friend.id} friend={friend} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'received' && (
          <motion.div
            key="received"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {loadingReceived ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : received.length === 0 ? (
              <EmptyState
                icon={UserPlus}
                title="No pending requests"
                description="When someone sends you a friend request, it will appear here."
              />
            ) : (
              <div className="space-y-3">
                {received.map((req) => (
                  <ReceivedRequestCard key={req._id} request={req} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'sent' && (
          <motion.div
            key="sent"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            {loadingSent ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : sent.length === 0 ? (
              <EmptyState
                icon={Clock}
                title="No sent requests"
                description="Friend requests you send will appear here."
              />
            ) : (
              <div className="space-y-3">
                {sent.map((req) => (
                  <SentRequestCard key={req._id} request={req} />
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by username..."
                autoFocus
                className={cn(
                  'w-full pl-9 pr-4 py-2.5 text-sm rounded-md border border-input bg-background',
                  'text-foreground placeholder:text-muted-foreground',
                  'outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors'
                )}
              />
            </div>

            {!debouncedSearch ? (
              <EmptyState
                icon={Search}
                title="Search for students"
                description="Type a username to find and connect with other students."
              />
            ) : loadingSearch ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : searchResults.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No users found"
                description={`No students found with username "${debouncedSearch}".`}
              />
            ) : (
              <div className="space-y-3">
                {searchResults.map((user) => (
                  <SearchUserCard key={user._id || user.id} user={user} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Friends