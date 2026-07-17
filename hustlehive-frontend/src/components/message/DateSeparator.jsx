const DateSeparator = ({ date }) => {
  if (!date) return null

  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return null

  const label = (() => {
    const now = new Date()
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)

    if (parsed.toDateString() === now.toDateString()) return 'Today'
    if (parsed.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return parsed.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  })()

  return (
    <div className="flex items-center gap-3 my-4 px-4">
      <div className="flex-1 h-px bg-border" />
      <span className="text-[11px] text-muted-foreground font-medium px-2 whitespace-nowrap">
        {label}
      </span>
      <div className="flex-1 h-px bg-border" />
    </div>
  )
}

export default DateSeparator