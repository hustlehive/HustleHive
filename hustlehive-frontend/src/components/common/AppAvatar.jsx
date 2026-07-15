import { getInitials } from '@/utils/getInitials'
import { cn } from '@/utils/cn'

const sizeMap = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-xl',
  '2xl': 'w-24 h-24 text-3xl',
}

const AppAvatar = ({ src, name, size = 'md', className }) => {
  const sizeClass = sizeMap[size] || sizeMap.md

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'avatar'}
        className={cn('rounded-full object-cover shrink-0', sizeClass, className)}
        loading="lazy"
      />
    )
  }

  return (
    <div
      className={cn(
        'rounded-full bg-primary/10 text-primary font-semibold',
        'flex items-center justify-center shrink-0 select-none',
        sizeClass,
        className
      )}
      aria-label={name || 'User avatar'}
    >
      {getInitials(name)}
    </div>
  )
}

export default AppAvatar