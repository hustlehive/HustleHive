import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  MapPin,
  Mail,
  Briefcase,
  Users,
  UserPlus,
  UserMinus,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  usePublicProfile,
  useUserHustles,
  useUserFriends,
} from '@/features/users/useProfile'
import {
  useFriends,
  useSendFriendRequest,
  useUnfriend,
} from '@/features/users/useFriends'
import { startConversation } from '@/api/messages.api'
import HustleCard from '@/components/hustle/HustleCard'
import HustleCardSkeleton from '@/components/skeletons/HustleCardSkeleton'
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton'
import AppAvatar from '@/components/common/AppAvatar'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import useAuth from '@/hooks/useAuth'
import { useState as useLocalState } from 'react'

const TABS = [
  { id: 'hustles', label: 'Hustles', icon: Briefcase },
  { id: 'friends', label: 'Friends', icon: Users },
]

const PublicProfile = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [activeTab, setActiveTab] = useState('hustles')
  const [unfriendOpen, setUnfriendOpen] = useState(false)
  const [isMessaging, setIsMessaging] = useState(false)

  const currentUserId = (authUser?._id || authUser?.id)?.toString()

  // Redirect to own profile if visiting own userId
  if (userId === currentUserId) {
    navigate(ROUTES.PROFILE, { replace: true })
    return null
  }

  const { data: profileData, isLoading: loadingProfile } = usePublicProfile(userId)
  const { data: hustlesData, isLoading: loadingHustles } = useUserHustles(userId)
  const { data: friendsData, isLoading: loadingFriends } = useUserFriends(userId)
  const { data: myFriendsData } = useFriends()

  const { mutate: sendRequest, isPending: isSending } = useSendFriendRequest()
  const { mutate: unfriend, isPending: isUnfriending } = useUnfriend()

  const profile = profileData?.user
  const hustles = hustlesData?.hustles || []
  const friends = friendsData?.friends || []
  const myFriends = myFriendsData?.friends || []

  // Check relationship
  const isFriend = myFriends.some((f) => {
    const fId = (f._id || f.id)?.toString()
    return fId === userId
  })

  const handleMessage = async () => {
    if (!isFriend) return
    setIsMessaging(true)
    try {
      const data = await startConversation({
        type: 'friend',
        friendId: userId,
      })
      navigate(ROUTES.CONVERSATION(data.conversation._id))
    } catch (err) {
      toast.error(err.message)
    } finally {
      setIsMessaging(false)
    }
  }

  const handleUnfriend = () => {
    unfriend(userId, {
      onSuccess: () => setUnfriendOpen(false),
    })
  }

  if (loadingProfile) return (
    <div className="max-w-3xl mx-auto">
      <ProfileSkeleton />
    </div>
  )

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto text-center py-20">
        <p className="text-muted-foreground mb-4">User not found.</p>
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-sm bg-primary text-white rounded-md"
        >
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      {/* Profile header */}
      <div className="bg-card border border-border rounded-[15px] p-6 mb-5">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <AppAvatar
            src={profile.profilePic?.url}
            name={profile.fullName}
            size="2xl"
            className="border-4 border-background shadow-md shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-foreground">{profile.fullName}</h1>
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {isFriend ? (
                  <>
                    <button
                      onClick={handleMessage}
                      disabled={isMessaging}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60"
                    >
                      {isMessaging ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <MessageSquare className="w-3.5 h-3.5" />
                      )}
                      Message
                    </button>
                    <button
                      onClick={() => setUnfriendOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border text-muted-foreground rounded-md hover:text-destructive hover:border-destructive/30 hover:bg-destructive/10 transition-colors"
                    >
                      <UserMinus className="w-3.5 h-3.5" />
                      Unfriend
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => sendRequest(userId)}
                    disabled={isSending}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60"
                  >
                    {isSending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <UserPlus className="w-3.5 h-3.5" />
                    )}
                    Add Friend
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.college}</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <Mail className="w-3.5 h-3.5" />
              <span>{profile.email}</span>
            </div>

            {profile.bio && (
              <p className="mt-3 text-sm text-foreground leading-relaxed">{profile.bio}</p>
            )}

            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{hustles.length}</p>
                <p className="text-xs text-muted-foreground">Hustles</p>
              </div>
              {isFriend && (
                <div className="text-center">
                  <p className="text-lg font-bold text-foreground">{friends.length}</p>
                  <p className="text-xs text-muted-foreground">Friends</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg mb-5 w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
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

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'hustles' && (
            loadingHustles ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <HustleCardSkeleton key={i} />)}
              </div>
            ) : hustles.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No hustles yet"
                description={`${profile.fullName} hasn't posted any hustles.`}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hustles.map((hustle) => (
                  <HustleCard key={hustle._id} hustle={hustle} showIfOwner={true} />
                ))}
              </div>
            )
          )}

          {activeTab === 'friends' && (
            !isFriend ? (
              <EmptyState
                icon={Users}
                title="Friends list is private"
                description={`You need to be friends with ${profile.fullName} to see their friends.`}
              />
            ) : loadingFriends ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-[15px] animate-pulse" />
                ))}
              </div>
            ) : friends.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No friends yet"
                description={`${profile.fullName} hasn't connected with anyone yet.`}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {friends.map((friend) => {
                  const fId = (friend._id || friend.id)?.toString()
                  return (
                    <div
                      key={fId}
                      onClick={() => navigate(
                        fId === currentUserId
                          ? ROUTES.PROFILE
                          : ROUTES.PUBLIC_PROFILE(fId)
                      )}
                      className="bg-card border border-border rounded-[15px] p-3 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
                    >
                      <AppAvatar src={friend.profilePic?.url} name={friend.fullName} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {friend.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          @{friend.username} · {friend.college}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )}
        </motion.div>
      </AnimatePresence>

      <ConfirmDialog
        open={unfriendOpen}
        onClose={() => setUnfriendOpen(false)}
        onConfirm={handleUnfriend}
        isPending={isUnfriending}
        title={`Unfriend ${profile.fullName}?`}
        description="You will no longer be friends. You can send a friend request again later."
        confirmText="Unfriend"
        variant="destructive"
      />
    </div>
  )
}

export default PublicProfile