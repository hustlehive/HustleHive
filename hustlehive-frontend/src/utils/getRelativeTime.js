export const getRelativeTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) {
    const m = Math.floor(diffInSeconds / 60)
    return `${m}m ago`
  }
  if (diffInSeconds < 86400) {
    const h = Math.floor(diffInSeconds / 3600)
    return `${h}h ago`
  }
  if (diffInSeconds < 604800) {
    const d = Math.floor(diffInSeconds / 86400)
    return `${d}d ago`
  }
  return new Date(dateString).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
  })
}

export const getMessageTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'

  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
}