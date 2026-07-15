import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/utils/cn'

const Pagination = ({ page, totalPages, onPageChange, className }) => {
  if (!totalPages || totalPages <= 1) return null

  const getPages = () => {
    const pages = []
    const delta = 1
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - delta && i <= page + delta)) {
        pages.push(i)
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...')
      }
    }
    return pages
  }

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Previous page"
        className="p-2 rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {getPages().map((p, idx) =>
        p === '...' ? (
          <span key={`ellipsis-${idx}`} className="px-2 py-1 text-sm text-muted-foreground">
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'min-w-[36px] h-9 px-2 rounded-md text-sm font-medium transition-colors',
              p === page
                ? 'bg-primary text-white'
                : 'border border-border text-muted-foreground hover:bg-accent hover:text-foreground'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        aria-label="Next page"
        className="p-2 rounded-md border border-border text-muted-foreground hover:bg-accent hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default Pagination