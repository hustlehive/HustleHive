const NotificationSkeleton = () => {
  return (
    <div className="flex items-start gap-3 p-3 animate-pulse">
      <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-2.5 bg-muted rounded w-16 mt-1" />
      </div>
    </div>
  )
}

export default NotificationSkeleton