const HustleCardSkeleton = () => {
  return (
    <div className="bg-card border border-border rounded-[15px] overflow-hidden animate-pulse">
      <div className="h-40 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 bg-muted rounded w-16" />
          <div className="h-5 bg-muted rounded-full w-16" />
        </div>
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="space-y-1.5">
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
        </div>
        <div className="flex items-center gap-2 pt-1">
          <div className="w-6 h-6 bg-muted rounded-full" />
          <div className="h-3 bg-muted rounded w-24" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 bg-muted rounded w-16" />
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  )
}

export default HustleCardSkeleton