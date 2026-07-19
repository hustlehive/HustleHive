import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Camera,
  Edit2,
  Trash2,
  User,
  Briefcase,
  FileText,
  Users,
  Check,
  X,
  Loader2,
  MapPin,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  useMyProfile,
  useUpdateProfile,
  useUploadProfilePicture,
  useDeleteProfilePicture,
  useUserHustles,
} from '@/features/users/useProfile'
import { useFriends } from '@/features/users/useFriends'
import { useMyApplications } from '@/features/hustles/useHustles'
import HustleCard from '@/components/hustle/HustleCard'
import HustleCardSkeleton from '@/components/skeletons/HustleCardSkeleton'
import ProfileSkeleton from '@/components/skeletons/ProfileSkeleton'
import AppAvatar from '@/components/common/AppAvatar'
import EmptyState from '@/components/common/EmptyState'
import ConfirmDialog from '@/components/common/ConfirmDialog'
import StatusBadge from '@/components/common/StatusBadge'
import ImageCropper from '@/components/common/ImageCropper'
import { formatDate } from '@/utils/formatDate'
import { formatReward } from '@/utils/formatReward'
import { ROUTES } from '@/constants/routes'
import { cn } from '@/utils/cn'
import useAuth from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const TABS = [
  { id: 'about', label: 'About', icon: User },
  { id: 'hustles', label: 'My Hustles', icon: Briefcase },
  { id: 'applications', label: 'Applications', icon: FileText },
  { id: 'friends', label: 'Friends', icon: Users },
]

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
})

// ── About Tab ──
const AboutTab = ({ user, isEditing, setIsEditing }) => {
  const { mutate: updateProfile, isPending } = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || '',
      bio: user?.bio || '',
    },
  })

  const bio = watch('bio') || ''

  const onSubmit = (data) => {
    updateProfile(data, {
      onSuccess: () => setIsEditing(false),
    })
  }

  const handleCancel = () => {
    reset({ fullName: user?.fullName || '', bio: user?.bio || '' })
    setIsEditing(false)
  }

  return (
    <div className="space-y-4">
      {isEditing ? (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-card border border-border rounded-[15px] p-5 space-y-4"
        >
          <h3 className="text-sm font-semibold text-foreground">Edit Profile</h3>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground">Full Name</label>
            <input
              {...register('fullName')}
              className={cn(
                'w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground',
                'outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                errors.fullName ? 'border-destructive' : 'border-input'
              )}
            />
            {errors.fullName && (
              <p className="text-xs text-destructive">{errors.fullName.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-muted-foreground">Bio</label>
              <span className="text-xs text-muted-foreground">{bio.length}/200</span>
            </div>
            <textarea
              {...register('bio')}
              rows={3}
              placeholder="Tell people about yourself..."
              className={cn(
                'w-full px-3 py-2 text-sm rounded-md border bg-background text-foreground',
                'outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none',
                'placeholder:text-muted-foreground',
                errors.bio ? 'border-destructive' : 'border-input'
              )}
            />
            {errors.bio && (
              <p className="text-xs text-destructive">{errors.bio.message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-sm text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium bg-primary text-white rounded-md hover:bg-primary/90 transition-colors disabled:opacity-60"
            >
              {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-card border border-border rounded-[15px] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">About</h3>
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-muted-foreground border border-border rounded-md hover:bg-accent transition-colors"
            >
              <Edit2 className="w-3 h-3" />
              Edit
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Full Name</p>
              <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Username</p>
              <p className="text-sm text-foreground">@{user?.username}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Email</p>
              <p className="text-sm text-foreground">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">College</p>
              <p className="text-sm text-foreground">{user?.college}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">Bio</p>
              <p className="text-sm text-foreground leading-relaxed">
                {user?.bio || (
                  <span className="text-muted-foreground italic">No bio yet. Click Edit to add one.</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Applications Tab ──
const ApplicationsTab = () => {
  const { data, isLoading } = useMyApplications()
  const applications = data?.applications || []

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-[15px] animate-pulse" />
        ))}
      </div>
    )
  }

  if (applications.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No applications yet"
        description="Applications you submit will appear here."
      />
    )
  }

  return (
    <div className="space-y-3">
      {applications.map((app) => (
        <div
          key={app._id}
          className="bg-card border border-border rounded-[15px] p-4 flex items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {app.hustle?.title || 'Hustle deleted'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">
                {formatReward(app.hustle?.reward)}
              </span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(app.createdAt)}
              </span>
            </div>
          </div>
          <StatusBadge status={app.status} />
        </div>
      ))}
    </div>
  )
}

// ── Friends Tab ──
const FriendsTab = () => {
  const { data, isLoading } = useFriends()
  const friends = data?.friends || []
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-[15px] animate-pulse" />
        ))}
      </div>
    )
  }

  if (friends.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="No friends yet"
        description="Connect with other students from the Friends page."
      />
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {friends.map((friend) => {
        const friendId = (friend._id || friend.id)?.toString()
        return (
          <div
            key={friendId}
            onClick={() => navigate(ROUTES.PUBLIC_PROFILE(friendId))}
            className="bg-card border border-border rounded-[15px] p-3 flex items-center gap-3 cursor-pointer hover:border-primary/30 transition-colors"
          >
            <AppAvatar src={friend.profilePic?.url} name={friend.fullName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{friend.fullName}</p>
              <p className="text-xs text-muted-foreground truncate">
                @{friend.username} · {friend.college}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ── Main Profile Page ──
const Profile = () => {
  const { user: authUser } = useAuth()
  const userId = (authUser?._id || authUser?.id)?.toString()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('about')
  const [isEditing, setIsEditing] = useState(false)
  const [deletePicOpen, setDeletePicOpen] = useState(false)
  const [cropperOpen, setCropperOpen] = useState(false)
  const [rawImageSrc, setRawImageSrc] = useState(null)
  const fileInputRef = useRef(null)

  const { data, isLoading } = useMyProfile()
  const { data: hustlesData, isLoading: loadingHustles } = useUserHustles(userId)

  const { mutate: uploadPic, isPending: isUploading } = useUploadProfilePicture()
  const { mutate: deletePic, isPending: isDeleting } = useDeleteProfilePicture()

  const user = data?.user || authUser
  const hustles = hustlesData?.hustles || []

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setRawImageSrc(ev.target.result)
      setCropperOpen(true)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const handleCropComplete = (file) => {
    setCropperOpen(false)
    setRawImageSrc(null)
    const formData = new FormData()
    formData.append('image', file)
    uploadPic(formData)
  }

  const handleDeletePic = () => {
    deletePic(undefined, { onSuccess: () => setDeletePicOpen(false) })
  }

  if (isLoading) return <ProfileSkeleton />

  return (
    <div className="max-w-3xl mx-auto">
      {/* Profile header card */}
      <div className="bg-card border border-border rounded-[15px] p-6 mb-5">
        <div className="flex flex-col sm:flex-row items-start gap-5">
          {/* Avatar with upload overlay */}
          <div className="relative shrink-0">
            <AppAvatar
              src={user?.profilePic?.url}
              name={user?.fullName}
              size="2xl"
              className="border-4 border-background shadow-md"
            />
            {/* Upload overlay */}
            <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="w-6 h-6 text-white animate-spin" />
              ) : (
                <Camera className="w-6 h-6 text-white" />
              )}
              <span className="text-[10px] text-white font-medium">Change</span>
            </div>

            {/* Delete pic button */}
            {user?.profilePic?.url && (
              <button
                onClick={() => setDeletePicOpen(true)}
                className="absolute -bottom-1 -right-1 w-7 h-7 bg-destructive text-white rounded-full flex items-center justify-center hover:bg-destructive/90 transition-colors shadow-md"
                title="Remove profile picture"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>

          {/* User info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-xl font-bold text-foreground">{user?.fullName}</h1>
                <p className="text-sm text-muted-foreground">@{user?.username}</p>
              </div>
              <button
                onClick={() => { setActiveTab('about'); setIsEditing(true) }}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-border rounded-md hover:bg-accent transition-colors shrink-0"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
            </div>

            <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
              <MapPin className="w-3.5 h-3.5" />
              <span>{user?.college}</span>
            </div>

            {user?.bio && (
              <p className="mt-3 text-sm text-foreground leading-relaxed">{user.bio}</p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-5 mt-4 pt-4 border-t border-border">
              <div className="text-center">
                <p className="text-lg font-bold text-foreground">{hustles.length}</p>
                <p className="text-xs text-muted-foreground">Hustles</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-muted/50 p-1 rounded-lg mb-5 overflow-x-auto no-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setIsEditing(false) }}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all whitespace-nowrap flex-1 justify-center',
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
          {activeTab === 'about' && (
            <AboutTab user={user} isEditing={isEditing} setIsEditing={setIsEditing} />
          )}

          {activeTab === 'hustles' && (
            loadingHustles ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <HustleCardSkeleton key={i} />)}
              </div>
            ) : hustles.length === 0 ? (
              <EmptyState
                icon={Briefcase}
                title="No hustles yet"
                description="Hustles you create will appear here."
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {hustles.map((hustle) => (
                  <HustleCard key={hustle._id} hustle={hustle} showIfOwner={true} />
                ))}
              </div>
            )
          )}

          {activeTab === 'applications' && <ApplicationsTab />}
          {activeTab === 'friends' && <FriendsTab />}
        </motion.div>
      </AnimatePresence>

      {/* Delete picture confirmation */}
      <ConfirmDialog
        open={deletePicOpen}
        onClose={() => setDeletePicOpen(false)}
        onConfirm={handleDeletePic}
        isPending={isDeleting}
        title="Remove profile picture?"
        description="Your profile picture will be permanently deleted."
        confirmText="Remove"
        variant="destructive"
      />

      {/* Profile picture cropper - 1:1 */}
      <ImageCropper
        open={cropperOpen}
        imageSrc={rawImageSrc}
        aspect={1}
        title="Crop Profile Picture"
        onComplete={handleCropComplete}
        onCancel={() => { setCropperOpen(false); setRawImageSrc(null) }}
      />
    </div>
  )
}

export default Profile