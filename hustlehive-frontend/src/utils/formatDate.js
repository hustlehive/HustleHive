export const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const isDeadlinePassed = (dateString) => {
  if (!dateString) return false
  return new Date(dateString) < new Date()
}

export const getDaysUntilDeadline = (dateString) => {
  if (!dateString) return null
  const diff = new Date(dateString) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}