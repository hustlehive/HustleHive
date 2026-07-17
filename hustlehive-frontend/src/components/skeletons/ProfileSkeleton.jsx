const ProfileSkeleton = () => {
  return (
    <div className="animate-pulse">
      {/* Cover + avatar */}
      <div className="h-32 bg-muted rounded-[15px] mb-4" />
      <div className="flex items-end gap-4 px-2 -mt-12 mb-6">
        <div className="w-24 h-24 rounded-full bg-muted border-4 border-background shrink-0" />
        <div className="flex-1 pb-2 space-y-2">
          <div className="h-5 bg-muted rounded w-40" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
      </div>
      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-9 bg-muted rounded-md flex-1" />
        ))}
      </div>
      {/* Content */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 bg-muted rounded-[15px]" />
        ))}
      </div>
    </div>
  )
}

export default ProfileSkeleton